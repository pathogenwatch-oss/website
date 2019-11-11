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

  const taxids = await Genome.distinct('analysis.speciator.speciesId', { public: true })
  for (let taxid of taxids) {
    const docs = await Genome.find({'analysis.speciator.speciesId': taxid, public: true }, { limit: 4 }).lean()
    append(output, 'genome', ...docs)
    for (let doc of docs) {
      fileIds.add(doc.fileId)
      await addAnalysis(output, doc)
    }
  }

  await Genome.find({ reference: true })
    .lean()
    .cursor()
    .eachAsync(async doc => {
      if (fileIds.has(doc.fileId)) return;
      fileIds.add(doc.fileId);
      append(output, 'genome', doc);
      await addAnalysis(output, doc)
    })

  const collection = await Collection.findOne({ 
    access: "public",
    organismId: "1280",
    token: "gn1lxjtquy8s-harris-et-al-2013" // https://pathogen.watch/collection/gn1lxjtquy8s-harris-et-al-2013
  }).lean()
  append(output, 'collection', collection)

  await Genome.find({ _id: { $in: collection.genomes }, public: true })
    .lean()
    .cursor()
    .eachAsync(async doc => {
      if (fileIds.has(doc.fileId)) return;
      fileIds.add(doc.fileId);
      append(output, 'genome', doc);
      await addAnalysis(output, doc)
    })

  await Genome.find({'analysis.speciator.speciesId': "485", public: true })
    .lean()
    .cursor()
    .eachAsync(async doc => {
      if (fileIds.has(doc.fileId)) return;
      fileIds.add(doc.fileId);
      append(output, 'genome', doc);
      await addAnalysis(output, doc)
    })

  append(output, '__fileIds', { fileIds })

  await Organism.find({})
    .lean()
    .cursor()
    .eachAsync(async doc => {
      fileIds.add(doc.fileId);
      append(output, 'organisms', doc);
    })

  console.log("Done")
  await mongoConnection.close()

  return
}

main().catch(err => {
  throw err;
})
