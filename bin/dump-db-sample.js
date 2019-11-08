// Dumps genomes and analysis data for a development environment.
// Also dumps a collection

const fs = require('fs');
const argv = require('named-argv');
const mongoConnection = require('utils/mongoConnection');

const Genome = require('models/genome');
const Collection = require('models/collection');
const Analysis = require('models/analysis')

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

  const fileIds = new Set()

  const taxids = await Genome.distinct('analysis.speciator.speciesId', { public: true })
  for (let taxid of taxids) {
    const doc = await Genome.findOne({'analysis.speciator.speciesId': taxid, public: true }).lean()
    append(output, 'genome', doc)
    fileIds.add(doc.fileId)
  }

  const collection = await Collection.findOne({ 
    access: "public",
    organismId: "1280",
    token: "gn1lxjtquy8s-harris-et-al-2013" // https://pathogen.watch/collection/gn1lxjtquy8s-harris-et-al-2013
  }).lean()
  append(output, 'collection', collection)

  await Genome.find({ _id: { $in: collection.genomes }, public: true })
    .lean()
    .cursor()
    .eachAsync(doc => {
      fileIds.add(doc.fileId);
      append(output, 'genome', doc);
    })

  await Genome.find({'analysis.speciator.speciesId': "485", public: true })
    .lean()
    .cursor()
    .eachAsync(doc => {
      fileIds.add(doc.fileId);
      append(output, 'genome', doc);
    })

  await Analysis.find({ fileId: { $in: [...fileIds] }})
    .lean()
    .cursor()
    .eachAsync(doc => {
      fileIds.add(doc.fileId);
      append(output, 'genome', doc);
    })

  console.log("Done")

  return
}

main().catch(err => {
  throw err;
})
