const aws = require('aws-sdk');
const https = require('https');
const zlib = require('zlib');
const { promisify } = require('util')

const { objectStore: config } = require('configuration');
if (config.bucket === undefined) throw new Error('objectStore.bucket must be in config')

function isJSONable(a) {
  if (Array.isArray(a)) return true;
  // From https://stackoverflow.com/a/16608074
  // By Zupa: https://stackoverflow.com/users/926988/zupa
  return (!!a) && (a.constructor === Object);
};
const gzip = promisify(zlib.gzip)
const gunzip = promisify(zlib.gunzip)

const s3 = new aws.S3({
  endpoint: config.endpoint ? new aws.Endpoint(config.endpoint) : undefined,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  httpOptions: {
    agent: new https.Agent({ keepAlive: true, timeout: 100 })
  },
  maxRetries: 0,
});

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const HOURS = 60 * MINUTES;
const DAYS = 24 * HOURS;

const MIN_DELAY = 5;
const MAX_DELAY = 100;
const INITIAL_DELAY = 1000 / 75;

function sleep(t) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), t)
  })
}

class Throttle {
  constructor() {
    this.delay = INITIAL_DELAY;
    this.errors = 0;
    this.counterStart = new Date();
    this.last = Promise.resolve()
  }

  async wait() {
    this.last = new Promise(async resolve => {
      await this.last;
      this.__updateDelay();
      await sleep(this.delay);
      resolve();
    })
    return this.last;
  }

  fail() {
    this.errors++;
  }

  __updateDelay() {
    const now = new Date();
    if (this.errors > 5) {
      this.delay = this.delay > 50 ? this.delay * 1.2 : 50;
      this.errors = 0;
      this.counterStart = now;
    } else if (now - this.counterStart > 100) {
      if (this.errors > 0) {
        this.delay *= 1.2;
        this.delay = this.delay > MAX_DELAY ? MAX_DELAY : this.delay
      } else {
        this.delay *= 0.9;
        this.delay = this.delay < MIN_DELAY ? MIN_DELAY : this.delay
      }
      this.errors = 0;
      this.counterStart = now;
    }
  }
}

function remove(arr, el) {
  const index = arr.indexOf(el);
  if (index > -1) arr.splice(index, 1)
}

const MAX_CONCURRENCY = 5;
const MAX_ATTEMPTS = 10;

class ObjectStore {
  constructor() {
    this.throttle = new Throttle();
    this.requests = 0;
    this.counterStart = new Date();
    this.inProgress = [];
    this.queue = [];
  }

  analysisKey(task, version, fileId, organismId) {
    if (organismId === undefined) return `${config.prefix || ''}analysis/${task}/${version}/${fileId.slice(0, 2)}/${fileId}.json.gz`
    return `${config.prefix || ''}analysis/${task}/${version}/${fileId.slice(0, 2)}/${fileId}-${organismId}.json.gz`
  }

  putAnalysis(task, version, fileId, organismId, data, params={}) {
    const key = this.analysisKey(task, version, fileId, organismId);
    return this.put(key, data, params)
  }

  getAnalysis(task, version, fileId, organismId, params={}) {
    const key = this.analysisKey(task, version, fileId, organismId);
    return this.get(key, params)
  }

  fastaKey(fileId) {
    return `${config.prefix || ''}fasta/${fileId.slice(0, 2)}/${fileId}.fa.gz`
  }

  async putFasta(fileId, data, params={}) {
    const key = this.fastaKey(fileId);
    await this.put(key, data, params);
    return key;
  }

  getFasta(fileId, params={}) {
    const key = this.fastaKey(fileId);
    return this.get(key, params)
  }

  async* getScoreCache(fileIds, versions, type) {
    const fieldName = (type === 'score') ? 'scores' : 'differences';
    for (const fileId of fileIds) {
      cacheByFileId[fileId] = {};
    }

    const orderedFileIds = [...fileIds];
    orderedFileIds.sort();
  
    const analysisKeys = orderedFileIds.map(fileId => store.analysisKey('tree-score', `${versions.core}_${versions.tree}`, fileId))
    for await (const value of store.iterGet(analysisKeys)) {
      if (value === undefined) continue
      const doc = JSON.parse(value);
      if (doc.versions.core != versions.core) continue;
      if (doc.versions.tree != versions.tree) continue;
      
      for (const fileId of fileIds) {
        cacheByFileId[doc.fileId][fileId] = doc[fieldName][fileId];
      }
    }
    return cacheByFileId;
  }

  async get(key, { decompress=true, ...params }={}) {
    if (params.outStream && decompress) {
      const oldOutStream = params.outStream;
      params.outStream = zlib.createGunzip()
      params.outStream.pipe(oldOutStream)
    }
    let resp;
    try {
      resp = await this.request('get', { key, timeout: 50, ...params });
    } catch (err) {
      return undefined
    }
    if (!params.outStream) {
      if (decompress) {
        return await gunzip(resp.Body);
      } else {
        return resp.Body;
      }
    }
    return;
  }
  
  async put(key, data, { compress=true, ...params }={}) {
    let rawData = isJSONable(data) ? JSON.stringify(data) : data;
    if (compress) {
      rawData = rawData.pipe ? rawData.pipe(zlib.createGzip()) : await gzip(rawData)
    }
    return this.request('put', { key, timeout: 200, ...params, data: rawData })
  }

  async copy(srcKey, destKey) {
    return this.request('copy', { srcKey, key: destKey })
  }

  async delete(key) {
    const r = await this.request('delete', { key });
    return { Key: key, ...r };
  }

  async move(srcKey, destKey) {
    await this.copy(srcKey, destKey)
    return this.delete(srcKey)
  }

  async* list(prefix, delimiter='/') {
    let continuationToken = undefined;
    while (true) {
      const r = await this.request('list', {
        Bucket: config.bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
        Delimiter: delimiter === null ? undefined : delimiter,
      })
      const { Contents: contents=[], CommonPrefixes: folders=[] } = r;
      for (const d of contents) yield { type: 'file', ...d };
      for (const d of folders) yield { type: 'dir', Key: d.Prefix };
      continuationToken = r.NextContinuationToken;
      if (continuationToken === undefined) break;
    }
  }
  
  async request(method, params={}) {
    const job = { method, params };
    const output = new Promise(async (resolve, reject) => {
      job.pass = (v) => { this.requests++; return resolve(v); };
      job.fail = (e) => { this.requests++; return reject(e); };
    })
    this.queue.push(job)
    this.__next()
    return output
  }

  async __next() {
    if (this.inProgress.length >= MAX_CONCURRENCY) return
    
    const job = this.queue.shift();
    if (job === undefined) return;
    this.inProgress.push(job)

    let r;
    for (let attempt=0; attempt<MAX_ATTEMPTS; attempt++) {
      await this.throttle.wait();

      if (attempt >= 3) job.params.timeout *= 2
      try {
        const s3Params = {
          Bucket: config.bucket,
          Key: job.params.key
        }
        if (job.method === 'get') {
          const req = s3.getObject(s3Params);
          if (job.params.outStream) {
            r = await new Promise((resolve, reject) => {
              req.on('complete', (resp) => {
                const { statusCode, statusMessage } = resp.httpResponse;
                resolve({ statusCode, statusMessage })
              }).on('error', error => reject(error))
              req.createReadStream().pipe(job.params.outStream)
            })
          } else {
            r = await req.promise();
          }
        } else if (job.method === 'put') {
          r = await s3.upload({ ...s3Params, Body: job.params.data, ACL: 'private' }).promise()
        } else if (job.method === 'copy') {
          r = await s3.copyObject({ ...s3Params, CopySource: `/${config.bucket}/${job.params.srcKey}` }).promise()
        } else if (job.method === 'delete') {
          r = await s3.deleteObject(s3Params).promise();
        } else if (job.method === 'list') {
          r = await s3.listObjectsV2(job.params).promise()
        } else {
          throw new Error(`Unknown method ${job.method}`)
        }
        r.statusCode = 200;
      } catch (error) {
        const { statusCode, code: statusMessage } = error
        r = { statusCode, statusMessage, error };
      }

      r.attempt = attempt;
      if (r.statusCode === 503 || r.error && r.error.retryable) {
        this.throttle.fail();
      } else break;
    }
    
    if (r.statusCode === 200) {
      job.pass(r);
    } else {
      job.fail(r.error ? r.error : new Error(`Status ${r.statusCode}: ${r.statusMessage || "Unknown"}`))
    }

    remove(this.inProgress, job)
    return this.__next()
  }

  async* iterGet(keys, { maxConcurrent=10, ...params }={}) {
    yield* this.iter(this.get.bind(this), keys, { maxConcurrent, ...params });
  }

  async* iterDelete(keys, { maxConcurrent=10, ...params }={}) {
    yield* this.iter(this.delete.bind(this), keys, { maxConcurrent, ...params });
  }

  async* iterPut(docs, { maxConcurrent=10, ...params }={}) {
    const fn = ({ key, data }) => this.put(key, data, params);
    yield* this.iter(fn, docs, { maxConcurrent })
  }

  async* iter(fn, keys, { maxConcurrent=10, ...params }={}) {
    const shift = Array.isArray(keys) ? keys.shift : async () => (await keys.next()).value;
    const inProgress = [];
    let nextTodo = await shift();
    for (let i=0; nextTodo !== undefined && i<maxConcurrent; i++) {
      inProgress.push(fn(nextTodo, params))
      nextTodo = await shift();
    }
    
    while (inProgress.length > 0 || nextTodo !== undefined) {
      const nextDone = inProgress.shift();
      if (nextTodo) inProgress.push(fn(nextTodo, params))
      yield await nextDone
      nextTodo = await shift();
    }
  }

  get rps() {
    const now = new Date();
    return this.requests * 1000 / (now - this.counterStart);
  }

  resetCounter() {
    this.requests = 0;
    this.counterStart = new Date();
  }
}

module.exports = new ObjectStore();
