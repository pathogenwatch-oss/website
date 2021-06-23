/* eslint-disable class-methods-use-this */

const aws = require('aws-sdk');
const http = require('http');
const https = require('https');
const zlib = require('zlib');
const { promisify } = require('util');

const { objectStore: config } = require('configuration');
const Pool = require('utils/concurrentWorkers');

if (config.bucket === undefined) throw new Error('objectStore.bucket must be in config');

function isJSONable(a) {
  if (Array.isArray(a)) return true;
  // From https://stackoverflow.com/a/16608074
  // By Zupa: https://stackoverflow.com/users/926988/zupa
  return (!!a) && (a.constructor === Object);
}

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);
const { extraS3Params = {} } = config;

const endpoint = config.endpoint ? new aws.Endpoint(config.endpoint) : undefined;
const s3 = new aws.S3({
  endpoint,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  httpOptions: {
    agent: endpoint.protocol === 'http:' ? new http.Agent({ keepAlive: true }) : new https.Agent({ keepAlive: true }),
  },
  maxRetries: 0,
  ...extraS3Params,
});

const MIN_DELAY = 5;
const MAX_DELAY = 100;
const INITIAL_DELAY = 1000 / 75;

function sleep(t) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), t);
  });
}

class Throttle {
  constructor() {
    this.delay = INITIAL_DELAY;
    this.errors = 0;
    this.counterStart = new Date();
    this.last = Promise.resolve();
  }

  /* eslint-disable no-async-promise-executor */
  async wait() {
    this.last = new Promise(async (resolve) => {
      await this.last;
      this.__updateDelay();
      await sleep(this.delay);
      resolve();
    });
    return this.last;
  }

  fail() {
    this.errors += 1;
  }

  __updateDelay() {
    const now = new Date();
    if (this.errors > 3) {
      this.delay = this.delay > 50 ? this.delay * 1.2 : 50;
      this.errors = 0;
      this.counterStart = now;
    } else if (now - this.counterStart > 100) {
      if (this.errors > 0) {
        this.delay *= 1.2;
        this.delay = this.delay > MAX_DELAY ? MAX_DELAY : this.delay;
      } else {
        this.delay *= 0.9;
        this.delay = this.delay < MIN_DELAY ? MIN_DELAY : this.delay;
      }
      this.errors = 0;
      this.counterStart = now;
    }
  }
}

const MAX_CONCURRENCY = 5;
const MAX_ATTEMPTS = 10;

class ObjectStore {
  constructor() {
    this.throttle = new Throttle();
    this.requests = 0;
    this.counterStart = new Date();
    this.pool = new Pool(this.__next.bind(this), MAX_CONCURRENCY);
  }

  get rps() {
    const now = new Date();
    return this.requests * 1000 / (now - this.counterStart);
  }

  analysisKey(task, version, fileId, organismId) {
    if (fileId === 'public') return `${config.prefix || ''}analysis/${task}/${version}/${fileId}.json.gz`;
    if (organismId === undefined) return `${config.prefix || ''}analysis/${task}/${version}/${fileId.slice(0, 2)}/${fileId}.json.gz`;
    return `${config.prefix || ''}analysis/${task}/${version}/${fileId.slice(0, 2)}/${fileId}-${organismId}.json.gz`;
  }

  putAnalysis(task, version, fileId, organismId, data, params = {}) {
    const key = this.analysisKey(task, version, fileId, organismId);
    return this.put(key, data, params);
  }

  getAnalysis(task, version, fileId, organismId, params = {}) {
    const key = this.analysisKey(task, version, fileId, organismId);
    return this.get(key, params);
  }

  fastaKey(fileId) {
    return `${config.prefix || ''}fasta/${fileId.slice(0, 2)}/${fileId}.fa.gz`;
  }

  async putFasta(fileId, data, params = {}) {
    const key = this.fastaKey(fileId);
    await this.put(key, data, params);
    return key;
  }

  getFasta(fileId, params = {}) {
    const key = this.fastaKey(fileId);
    return this.get(key, params);
  }

  readsKey(genomeId, fileNumber) {
    return `${config.prefix || ''}reads/${genomeId.slice(0, 2)}/${genomeId}_${fileNumber}.fastq.gz`;
  }

  async putReads(genomeId, fileNumber, data) {
    const key = this.readsKey(genomeId, fileNumber);
    await this.put(key, data);
    return key;
  }

  getReads(genomeId, fileNumber) {
    const key = this.readsKey(genomeId, fileNumber);
    return this.get(key);
  }

  async countReads(genomeId) {
    const prefix = `${config.prefix || ''}reads/${genomeId.slice(0, 2)}/${genomeId}_`;
    let count = 0;
    for await (const { Key, type } of this.list(prefix)) {
      if (type !== 'file') continue;
      if (/\d+.fastq.gz$/.test(Key)) count += 1;
    }
    return count;
  }

  async getScoreCache(genomes, versions, type) {
    const cacheByFileId = {};
    const fieldName = (type === 'score') ? 'scores' : 'differences';
    for (const { fileId } of genomes) {
      cacheByFileId[fileId] = {};
    }

    const orderedGenomes = [ ...genomes ];
    orderedGenomes.sort((a, b) => (a.fileId < b.fileId ? -1 : 1));

    const analysisKeys = orderedGenomes.map(({ fileId }) => this.analysisKey('core-tree-score', `${versions.core}_${versions.tree}`, fileId, undefined));
    for await (const value of this.iterGet(analysisKeys)) {
      if (value === undefined) continue;
      const doc = JSON.parse(value);
      if (doc.versions.core !== versions.core) continue;
      if (doc.versions.tree !== versions.tree) continue;

      for (const genome of orderedGenomes) {
        const { fileId } = genome;
        if (doc[fieldName][fileId] !== undefined) cacheByFileId[doc.fileId][fileId] = doc[fieldName][fileId];
      }
    }
    return cacheByFileId;
  }

  async get(key, { decompress = true, ...params } = {}) {
    if (params.outStream && decompress) {
      const oldOutStream = params.outStream;
      params.outStream = zlib.createGunzip();
      params.outStream.pipe(oldOutStream);
    }
    let resp;
    try {
      resp = await this.request('get', { key, timeout: 50, ...params });
    } catch (err) {
      return undefined;
    }
    if (!params.outStream) {
      if (decompress) {
        return gunzip(resp.Body);
      } else {
        return resp.Body;
      }
    }
    return undefined;
  }

  async put(key, data, { compress = true, ...params } = {}) {
    let rawData = isJSONable(data) ? JSON.stringify(data) : data;
    if (compress) {
      rawData = rawData.pipe ? rawData.pipe(zlib.createGzip()) : await gzip(rawData);
    }
    return this.request('put', { key, timeout: 200, ...params, data: rawData });
  }

  async copy(srcKey, destKey) {
    return this.request('copy', { srcKey, key: destKey });
  }

  async delete(key) {
    const r = await this.request('delete', { key });
    return { Key: key, ...r };
  }

  async move(srcKey, destKey) {
    await this.copy(srcKey, destKey);
    return this.delete(srcKey);
  }

  async* list(prefix, delimiter = '/') {
    let continuationToken;
    while (true) {
      const r = await this.request('list', {
        Bucket: config.bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
        Delimiter: delimiter === null ? undefined : delimiter,
      });
      const { Contents: contents = [], CommonPrefixes: folders = [] } = r;
      for (const d of contents) yield { type: 'file', ...d };
      for (const d of folders) yield { type: 'dir', Key: d.Prefix };
      continuationToken = r.NextContinuationToken;
      if (continuationToken === undefined) break;
    }
  }

  request(method, params = {}) {
    return this.pool.enqueue({ method, params });
  }

  async __next({ method, params }) {
    let r;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      await this.throttle.wait();

      if (attempt >= 3) params.timeout *= 2;
      try {
        const s3Params = {
          Bucket: config.bucket,
          Key: params.key,
        };
        if (method === 'get') {
          const req = s3.getObject(s3Params);
          if (params.outStream) {
            r = await new Promise((resolve, reject) => {
              req.on('complete', (resp) => {
                const { statusCode, statusMessage } = resp.httpResponse;
                resolve({ statusCode, statusMessage });
              }).on('error', (error) => reject(error));
              req.createReadStream().pipe(params.outStream);
            });
          } else {
            r = await req.promise();
          }
        } else if (method === 'put') {
          // const bar = await s3.createBucket({ Bucket: config.bucket })
          // const foo = await s3.listBuckets().promise();
          // const bar = await s3.listObjectsV2({ Bucket: s3Params.Bucket }).promise();
          // const ree = await s3.getBucketAcl({ Bucket: s3Params.Bucket }).promise();
          r = await s3.upload({ ...s3Params, Body: params.data, ACL: 'private' }).promise();
        } else if (method === 'copy') {
          r = await s3.copyObject({
            ...s3Params,
            CopySource: `/${config.bucket}/${params.srcKey}`,
            ACL: 'private',
          }).promise();
        } else if (method === 'delete') {
          r = await s3.deleteObject(s3Params).promise();
        } else if (method === 'list') {
          r = await s3.listObjectsV2(params).promise();
        } else {
          throw new Error(`Unknown method ${method}`);
        }
        r.statusCode = 200;
      } catch (error) {
        const { statusCode, code: statusMessage } = error;
        r = { statusCode, statusMessage, error };
        if (error.code === 'SlowDown' || statusCode === 503) await sleep(50);
      }

      r.attempt = attempt;
      if (r.statusCode === 503 || r.error && r.error.retryable) {
        this.throttle.fail();
      } else break;
    }

    if (r.statusCode === 200) {
      return r;
    }
    throw r.error ? r.error : new Error(`Status ${r.statusCode}: ${r.statusMessage || "Unknown"}`);
  }

  async* iterGet(keys, { maxConcurrent = 10, ...params } = {}) {
    yield* this.iter(this.get.bind(this), keys, { maxConcurrent, ...params });
  }

  async* iterDelete(keys, { maxConcurrent = 10, ...params } = {}) {
    yield* this.iter(this.delete.bind(this), keys, { maxConcurrent, ...params });
  }

  async* iterPut(docs, { maxConcurrent = 10, ...params } = {}) {
    const fn = ({ key, data }) => this.put(key, data, params);
    yield* this.iter(fn, docs, { maxConcurrent });
  }

  async* iter(fn, keys, { maxConcurrent = 10, ...params } = {}) {
    const shift = Array.isArray(keys) ? async () => keys.shift() : async () => (await keys.next()).value;
    const inProgress = [];
    let nextTodo = await shift();
    for (let i = 0; nextTodo !== undefined && i < maxConcurrent; i++) {
      inProgress.push(fn(nextTodo, params));
      nextTodo = await shift();
    }

    while (inProgress.length > 0 || nextTodo !== undefined) {
      const nextDone = inProgress.shift();
      if (nextTodo) inProgress.push(fn(nextTodo, params));
      yield await nextDone;
      nextTodo = await shift();
    }
  }

  resetCounter() {
    this.requests = 0;
    this.counterStart = new Date();
  }
}

module.exports = new ObjectStore();
