/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint max-params: 0 */

const BSON = require('bson');

const bson = new BSON();
const { Readable, Writable } = require('stream');
const readline = require('readline');

const Collection = require('models/collection');
const Genome = require('models/genome');
const TreeScores = require('models/treeScores');
const TaskLog = require('models/taskLog');
const docker = require('services/docker');
const store = require('utils/object-store');

const { getImageName } = require('manifest.js');
const { request } = require("services");

const LOGGER = require('utils/logging').createLogger('runner');

async function getGenomes(task, metadata) {
  const { collectionId, name: refName, organismId } = metadata;
  const { genomes } = await Collection.findOne(
    { _id: collectionId },
    { genomes: 1 },
  )
    .lean();

  let query = { _id: { $in: genomes } };
  if (task === 'subtree') {
    query = {
      'analysis.speciator.organismId': organismId,
      'analysis.core.fp.reference': refName,
      $or: [ { _id: { $in: genomes } }, { population: true } ],
    };
  }

  const docs = await Genome
    .find(query, { fileId: 1, name: 1 }, { sort: { fileId: 1 } })
    .lean();

  const ids = new Set(genomes.map((_) => _.toString()));

  return docs.map(({ _id, fileId, name }) => ({
    _id,
    fileId,
    name,
    population: !ids.has(_id.toString()),
  }));
}

async function* createGenomesStream(genomes, uncachedFileIds, versions, organismId) {
  const genomeLookup = {};
  for (const genome of genomes) {
    const { fileId } = genome;
    if (!uncachedFileIds.has(fileId)) continue;
    genomeLookup[fileId] = genomeLookup[fileId] || [];
    genomeLookup[fileId].push(genome);
  }

  const fileIds = Array.from(uncachedFileIds);
  fileIds.sort();

  const analysisKeys = fileIds.map((fileId) => store.analysisKey('core', versions.core, fileId, organismId));
  for await (const value of store.iterGet(analysisKeys)) {
    if (value === undefined) continue;
    const { fileId, results } = JSON.parse(value);
    genomeLookup[fileId] = genomeLookup[fileId] || [];
    for (const genomeDetails of genomeLookup[fileId]) {
      const genome = {
        ...genomeDetails,
        analysis: {
          core: {
            profile: results.profile,
          },
        },
      };
      yield genome;
    }
    genomeLookup[fileId] = [];
  }
}

async function readTreeScores(versions, fileIds) {
  const projection = fileIds.reduce((proj, fileId) => {
    proj[`scores.${fileId}`] = 1;
    return proj;
  }, { fileId: 1 });
  const cacheDocs = await TreeScores.find(
    { fileId: { $in: fileIds }, 'versions.core': versions.core, 'versions.tree': versions.tree },
    projection
  )
    .sort({ fileId: 1 })
    .lean()
    .cursor();

  return { stream: cacheDocs };
}

async function attachInputStream(container, versions, genomes, organismId, fileIds, stream) {
  const seen = new Set();

  async function* gen() {
    yield bson.serialize({ genomes });

    let uncachedFileIds = new Set();
    for await (const doc of stream) {
      yield bson.serialize(doc);

      seen.add(doc.fileId);
      for (const fileId of fileIds) {
        if (fileId >= doc.fileId) break; // Relies on the fileIds being in sorted order.
        if (doc.scores[fileId] === undefined) {
          uncachedFileIds.add(doc.fileId);
          uncachedFileIds.add(fileId);
        }
      }
    }

    for (const fileId of fileIds) {
      if (!seen.has(fileId)) {
        uncachedFileIds = new Set(fileIds);
        break;
      }
    }
    LOGGER.info(`Tree needs ${uncachedFileIds.size} of ${new Set(fileIds).size} genomes`);

    for await (const doc of createGenomesStream(genomes, uncachedFileIds, versions, organismId)) {
      yield bson.serialize(doc);
    }
  }

  const cores = Readable.from(gen());
  cores.on('error', (err) => {
    LOGGER.error(err);
    container.kill();
  });
  cores.pipe(container.stdin);
}

async function handleContainerOutput(container, task, versions, metadata, genomes) {
  const { clientId, name } = metadata;
  request('collection', 'send-progress', { clientId, payload: { task, name, status: 'IN PROGRESS' } });

  const lines = readline.createInterface({
    input: container.stdout,
    crlfDelay: Infinity,
  });

  let onNewick;
  let onError;
  const whenNewick = new Promise((resolve, reject) => {
    onNewick = resolve;
    onError = reject;
  });

  let lastProgress = 0;

  const handler = new Writable({
    objectMode: true,
    async write(line, _, done) {
      if (!line) return done();
      try {
        const doc = JSON.parse(line);
        if (doc.fileId && doc.scores) {
          await TreeScores.addScores(versions, doc);
          const progress = doc.progress * 0.99;
          if ((progress - lastProgress) >= 1) {
            request('collection', 'send-progress', { clientId, payload: { task, name, progress } });
            lastProgress = progress;
          }
        } else if (doc.progress) {
          const progress = doc.progress * 0.99;
          if ((progress - lastProgress) >= 1) {
            request('collection', 'send-progress', { clientId, payload: { task, name, progress } });
            lastProgress = progress;
          }
        } else {
          onNewick(doc.newick);
        }
        return done();
      } catch (e) {
        request('collection', 'send-progress', { clientId, payload: { task, name, status: 'ERROR' } });
        onError(e);
        return done(e);
      }
    },
  });

  Readable.from(lines).pipe(handler);
  const newick = await whenNewick;

  let populationSize = 0;
  if (task === 'subtree') {
    for (const { population } of genomes) {
      if (population) {
        populationSize += 1;
      }
    }
  }

  return {
    newick,
    populationSize,
    name: metadata.name,
    size: genomes.length,
    versions,
  };
}

async function handleContainerExit(container, task, versions, metadata, resources) {
  const { organismId, collectionId, clientId, name } = metadata;

  await container.start();
  const startTime = process.hrtime();
  LOGGER.info('spawn', container.id, 'running task', task, 'for collection', collectionId);

  const { StatusCode: exitCode } = await container.wait({ condition: 'next-exit' });
  LOGGER.info('exit', exitCode);

  const [ durationS, durationNs ] = process.hrtime(startTime);
  const duration = Math.round(durationS * 1000 + durationNs / 1e6);
  TaskLog.create({ collectionId, task, version: versions.tree, organismId, duration, exitCode, resources });

  if (exitCode !== 0) {
    request('collection', 'send-progress', { clientId, payload: { task, name, status: 'ERROR' } });
    if (container.timeout) throw new Error('timeout');
    if (exitCode === 137) throw new Error('killed');
    container.stderr.setEncoding('utf8');
    throw new Error(container.stderr.read());
  }
}

const random = () => Math.random().toString(36).slice(2, 10);

function createContainer(spec, metadata) {
  const { task, version, workers, resources, timeout } = spec;
  const { organismId, collectionId } = metadata;

  return docker(
    getImageName(task, version),
    {
      PW_ORGANISM_TAXID: organismId,
      PW_COLLECTION_ID: collectionId,
      PW_WORKERS: workers,
      // TODO: remove old API
      WGSA_ORGANISM_TAXID: organismId,
      WGSA_COLLECTION_ID: collectionId,
      WGSA_WORKERS: workers,
    },
    timeout,
    resources,
    { name: `tree_${random()}` }
  );
}

async function runTask(spec, metadata) {
  const { task, version, requires: taskRequires = [], resources = {} } = spec;
  const coreVersion = taskRequires.find((_) => _.task === 'core').version;
  const versions = { tree: version, core: coreVersion };

  const genomes = await getGenomes(task, metadata);
  if (genomes.length <= 1) {
    throw new Error('Not enough genomes to make a tree');
  } else if (genomes.length === 2) {
    return {
      newick: `(${genomes[0]._id}:0.5,${genomes[1]._id}:0.5);`,
      size: 2,
      populationSize: genomes.filter((_) => _.population).length,
      name: metadata.name,
    };
  }

  const fileIds = genomes.map((_) => _.fileId);
  fileIds.sort();

  const { organismId } = metadata;
  const { stream } = await readTreeScores(versions, fileIds);
  const container = await createContainer(spec, metadata);

  const whenContainerOutput = handleContainerOutput(container, task, versions, metadata, genomes);
  attachInputStream(container, versions, genomes, organismId, fileIds, stream);

  const whenContainerExit = handleContainerExit(container, task, versions, metadata, resources);

  const [ output, statusCode ] = await Promise.all([
    whenContainerOutput,
    whenContainerExit,
  ]);

  // I don't think these actually do anything.
  if (container.timeout) throw new Error('timeout');
  else if (statusCode === 137) throw new Error('killed');

  return output;
}

module.exports = runTask;

module.exports.handleContainerOutput = handleContainerOutput;
module.exports.handleContainerExit = handleContainerExit;
module.exports.createContainer = createContainer;
