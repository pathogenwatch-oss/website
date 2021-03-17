// Dumps genomes and analysis data for a development environment.
// Also dumps a collection
// Records should be dumped with dump-db-sample.js

const fs = require('fs');
const argv = require('named-argv');
const bson = require('bson');
const mongoConnection = require('utils/mongoConnection');

const BSON = new bson();
const Genome = require('models/genome');
const Collection = require('models/collection');
const Organism = require('models/organism');
const store = require('utils/object-store');

function append(path, type, ...docs) {
  docs.forEach(doc => fs.appendFileSync(path, JSON.stringify({ type, doc: doc.toString('base64') })+'\n'))
}

async function main() {
  const { output } = argv.opts;
  if (!output || output == true ) {
    console.log("Expected --output=XXX")
    process.exit(1)
  }

  fs.writeFileSync(output, '') // clear the document
  await mongoConnection.connect();

  const seenAnalysis = new Set()
  const genomeIds = {}

  async function addAnalysis(genome) {
    const tasks = Object.keys(genome.analysis || {})
    const { fileId } = genome;
    for (let task of tasks) {
      const { __v: version } = genome.analysis[task];
      const key = store.analysisKey(task, version, fileId)
      if (seenAnalysis.has(key)) continue;
      const value = await store.getAnalysis(task, version, fileId);
      if (value === undefined) continue;
      const doc = bson.serialize(JSON.parse(value))
      append(output, 'analysis', doc)
      seenAnalysis.add(key)
    }
  }

  async function addGenome(rawDoc) {
    const doc = BSON.deserialize(rawDoc)
    if (genomeIds[doc._id]) return;
    append(output, 'genome', rawDoc)
    genomeIds[doc._id] = doc.fileId;
    await addAnalysis(doc);
  }

  const taxids = await Genome.distinct('analysis.speciator.speciesId', { public: true })
  for (let taxid of taxids) {
    const taxidGenomes = Genome.collection.find({'analysis.speciator.speciesId': taxid, public: true }, { limit: 4, raw: true });
    while (await taxidGenomes.hasNext()) {
      const doc = await taxidGenomes.next();
      await addGenome(doc)
    }
  }

  const references = Genome.collection.find({ reference: true }, { raw: true })
  while (await references.hasNext()) {
    const doc = await references.next();
    await addGenome(doc)
  }

  const rawCollection = await Collection.collection.findOne({
    access: "public",
    organismId: "1280",
    token: "gn1lxjtquy8s-harris-et-al-2013" // https://pathogen.watch/collection/gn1lxjtquy8s-harris-et-al-2013
  }, { raw: true })
  append(output, 'collection', rawCollection)
  const collection = BSON.deserialize(rawCollection);

  const collectionGenomes = Genome.collection.find({ _id: { $in: collection.genomes }, public: true }, { raw: true })
  while (await collectionGenomes.hasNext()) {
    const doc = await collectionGenomes.next();
    await addGenome(doc)
  }

  const gonoGenomes = Genome.collection.find({'analysis.speciator.speciesId': "485", public: true }, {}, { limit: 1000, raw: true })
  while (await gonoGenomes.hasNext()) {
    const doc = await gonoGenomes.next();
    await addGenome(doc)
  }

  const organisms = Organism.collection.find({}, { raw: true })
  while (await organisms.hasNext()) {
    const doc = await organisms.next();
    append(output, 'organism', doc);
  }

  append(output, '__ids', genomeIds)

  console.log("Done")

  return mongoConnection.close()
}

main().catch(err => {
  console.log(err);
  process.exit(1);
})