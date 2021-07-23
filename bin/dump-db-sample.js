/* eslint-disable no-console */

// Dumps genomes and analysis data for a development environment.
// Also dumps a collection
// Records should be dumped with dump-db-sample.js

// Run with NODE_PATH='./src' node bin/dump-db-sample.js --output=sample.json

const fs = require('fs');
const argv = require('named-argv');
const BSON = require('bson');
const mongoConnection = require('utils/mongoConnection');

const bson = new BSON();

const Genome = require('models/genome');
const Collection = require('models/collection');
const Organism = require('models/organism');
const TreeScores = require('models/treeScores');
const store = require('utils/object-store');

function append(path, type, ...docs) {
  docs.forEach((doc) => fs.appendFileSync(path, `${JSON.stringify({ type, doc: doc.toString('base64') })}\n`));
}

async function main() {
  const { output } = argv.opts;
  if (!output || output === true) {
    console.log("Expected --output=XXX");
    process.exit(1);
  }

  fs.writeFileSync(output, ''); // clear the document
  await mongoConnection.connect();

  const seenAnalysis = new Set();
  const genomeIds = {};

  async function addAnalysis(genome, organismId) {
    const tasks = Object.keys(genome.analysis || {});
    const { fileId } = genome;
    for (const task of tasks) {
      const { __v: version } = genome.analysis[task];
      const key = store.analysisKey(task, version, fileId, organismId);
      if (seenAnalysis.has(key)) continue;
      const value = await store.getAnalysis(task, version, fileId, organismId);
      if (value === undefined) continue;
      const doc = bson.serialize(JSON.parse(value));
      append(output, 'analysis', doc);
      seenAnalysis.add(key);
    }
  }

  async function addGenome(rawDoc) {
    const doc = bson.deserialize(rawDoc);
    const organismId = doc.analysis.speciator.organismId;
    if (genomeIds[doc._id]) return;
    append(output, 'genome', rawDoc);
    genomeIds[doc._id] = doc.fileId;
    await addAnalysis(doc, organismId);
  }

  const taxids = (await Genome.distinct('analysis.speciator.speciesId', { public: true })).slice(0, 20);
  for (const taxid of taxids) {
    const taxidGenomes = Genome.collection.find({ 'analysis.speciator.speciesId': taxid, public: true }, { limit: 5, raw: true });
    while (await taxidGenomes.hasNext()) {
      const doc = await taxidGenomes.next();
      await addGenome(doc);
    }
  }

  const references = Genome.collection.find({ reference: true }, { raw: true });
  while (await references.hasNext()) {
    const doc = await references.next();
    await addGenome(doc);
  }

  const rawCollection = await Collection.collection.findOne({
    access: "public",
    organismId: "1280",
    token: "gn1lxjtquy8s-harris-et-al-2013", // https://pathogen.watch/collection/gn1lxjtquy8s-harris-et-al-2013
  }, { raw: true });
  append(output, 'collection', rawCollection);
  const collection = bson.deserialize(rawCollection);

  const collectionGenomes = Genome.collection.find({ _id: { $in: collection.genomes }, public: true }, { raw: true });
  const collectionFileIds = [];
  while (await collectionGenomes.hasNext()) {
    const doc = await collectionGenomes.next();
    await addGenome(doc);
    collectionFileIds.push(bson.deserialize(doc).fileId);
  }

  const populationGenomes = Genome.collection.find({ $or: [{ population: true }, { reference: true }], public: true, 'analysis.speciator.organismId': '1280' }, { raw: true });
  while (await populationGenomes.hasNext()) {
    const doc = await populationGenomes.next();
    await addGenome(doc);
    collectionFileIds.push(bson.deserialize(doc).fileId);
  }

  const scoresProjection = collectionFileIds.reduce((proj, fileId) => {
    proj[`scores.${fileId}`] = 1;
    proj[`differences.${fileId}`] = 1;
    return proj;
  }, { _id: 1, fileId: 1, versions: 1, __v: 1 });
  const scores = TreeScores.collection.find(
    { fileId: { $in: collectionFileIds } },
    { raw: true, projection: scoresProjection }
  );
  while (await scores.hasNext()) {
    const rawDoc = await scores.next();
    await append(output, 'treeScores', rawDoc);
  }

  const gonoGenomes = Genome.collection.find({ 'analysis.speciator.speciesId': "485", public: true }, {}, { limit: 1000, raw: true });
  while (await gonoGenomes.hasNext()) {
    const doc = await gonoGenomes.next();
    await addGenome(doc);
  }

  const organisms = Organism.collection.find({}, { raw: true });
  while (await organisms.hasNext()) {
    const doc = await organisms.next();
    append(output, 'organism', doc);
  }

  append(output, '__ids', bson.serialize(genomeIds));

  console.log("Done");

  return mongoConnection.close();
}

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
