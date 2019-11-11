// Dumps genomes and analysis data for a development environment.
// Also dumps a collection

const fs = require('fs');
const argv = require('named-argv');
const mongoConnection = require('utils/mongoConnection');

const Genome = require('models/genome');
const Collection = require('models/collection');
const Analysis = require('models/analysis');
const Organism = require('models/organism');

function append(path, type, ...docs) {
  docs.forEach(doc => fs.appendFileSync(path, JSON.stringify({ type, doc })+'\n'))
}

async function addAnalysis(path, genome) {
  const tasks = Object.keys(genome.analysis || {})
  const { fileId } = genome;
  for (let task of tasks) {
    const { __v: version } = genome.analysis[task];
    const doc = await Analysis.findOne({ fileId, task, version }).lean();
    append(path, 'analyses', doc)
  }
}

async function main() {
  const { output } = argv.opts;
  if (!output || output == true ) {
    console.log("Expected --output=XXX")
    process.exit(1)
  }

  fs.writeFileSync(output, '') // clear the document
  await mongoConnection.connect();

  const fileIds = new Set()
  const genomeIds = {}

  async function addGenome(doc) {
    if (genomeIds[doc._id]) return;
    append(output, 'genome', doc)
    genomeIds[doc._id] = doc.fileId;
    if (!doc.fileId || fileIds.has(doc.fileId)) return;
    await addAnalysis(output, doc);
    fileIds.add(doc.fileId)
  }

  const taxids = await Genome.distinct('analysis.speciator.speciesId', { public: true })
  for (let taxid of taxids) {
    await Genome.find({'analysis.speciator.speciesId': taxid, public: true }, { limit: 4 })
      .lean()
      .cursor()
      .eachAsync(async doc => addGenome(doc))
  }

  await Genome.find({ reference: true })
    .lean()
    .cursor()
    .eachAsync(async doc => addGenome(doc))

  const collection = await Collection.findOne({
    access: "public",
    organismId: "1280",
    token: "gn1lxjtquy8s-harris-et-al-2013" // https://pathogen.watch/collection/gn1lxjtquy8s-harris-et-al-2013
  }).lean()
  append(output, 'collection', collection)

  await Genome.find({ _id: { $in: collection.genomes }, public: true })
    .lean()
    .cursor()
    .eachAsync(async doc => addGenome(doc))

  await Genome.find({'analysis.speciator.speciesId': "485", public: true }, { limit: 1000 })
    .lean()
    .cursor()
    .eachAsync(async doc => addGenome(doc))

  await Organism.find({})
    .lean()
    .cursor()
    .eachAsync(async doc => {
      fileIds.add(doc.fileId);
      append(output, 'organisms', doc);
    })

  append(output, '__ids', genomeIds)

  console.log("Done")
  await mongoConnection.close()

  return
}

main().catch(err => {
  throw err;
})
