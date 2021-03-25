// Dumps genomes and analysis data for a development environment.
// Also dumps a collection
// Records should be dumped with dump-db-sample.js

const fs = require('fs');
const argv = require('named-argv');
const mongoConnection = require('utils/mongoConnection');

const Genome = require('models/genome');
const Collection = require('models/collection');
const Analysis = require('models/analysis');
const Organism = require('models/organism');
const { request } = require('services');

function append(path, type, ...docs) {
  docs.forEach(doc => fs.appendFileSync(path, JSON.stringify({ type, doc })+'\n'))
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
  const fileIds = {}
  const genomeIds = {}

  async function addAnalysis(genome) {
    const tasks = Object.keys(genome.analysis || {})
    const { fileId } = genome;
    for (let task of tasks) {
      const { __v: version } = genome.analysis[task];
      const key = `${fileId}|${task}|${version}`
      if (seenAnalysis.has(key)) continue;
      const doc = await Analysis.collection.findOne({ fileId, task, version });
      append(output, 'analysis', doc)
      seenAnalysis.add(key)
    }
  }

  async function addGenome(doc) {
    if (genomeIds[doc._id]) return;
    fileIds[doc.fileId] = doc.name;
    append(output, 'genome', doc)
    genomeIds[doc._id] = doc.fileId;
    await addAnalysis(doc);
  }

  const taxids = await Genome.distinct('analysis.speciator.speciesId', { public: true })
  for (let taxid of taxids) {
    const taxidGenomes = Genome.collection.find({'analysis.speciator.speciesId': taxid, public: true }, { limit: 4 });
    while (await taxidGenomes.hasNext()) {
      const doc = await taxidGenomes.next();
      await addGenome(doc)
    }
  }

  const references = Genome.collection.find({ reference: true })
  while (await references.hasNext()) {
    const doc = await references.next();
    await addGenome(doc)
  }

  const collection = await Collection.collection.findOne({
    access: "public",
    organismId: "1280",
    token: "gn1lxjtquy8s-harris-et-al-2013" // https://pathogen.watch/collection/gn1lxjtquy8s-harris-et-al-2013
  })
  append(output, 'collection', collection)
  
  const collectionGenomes = Genome.collection.find({ _id: { $in: collection.genomes }, public: true })
  while (await collectionGenomes.hasNext()) {
    const doc = await collectionGenomes.next();
    await addGenome(doc)
  }

  const gonoGenomes = Genome.collection.find({'analysis.speciator.speciesId': "485", public: true }, {}, { limit: 1000 })
  while (await gonoGenomes.hasNext()) {
    const doc = await gonoGenomes.next();
    await addGenome(doc)
  }

  const organisms = Organism.collection.find({})
  while (await organisms.hasNext()) {
    const doc = await organisms.next();
    append(output, 'organism', doc);
  }

  append(output, '__ids', genomeIds)

  const files = Object.keys(fileIds).map(fileId => ({ name: fileIds[fileId], fileId }));
  const fileStream = await request('download', 'create-genome-archive', { genomes: files })
  fileStream.pipe(fs.createWriteStream(`${output}.zip`))
  await new Promise(resolve => fileStream.on('end', resolve))

  console.log("Done")

  return mongoConnection.close()
}

main().catch(err => {
  console.log(err);
  process.exit(1);
})