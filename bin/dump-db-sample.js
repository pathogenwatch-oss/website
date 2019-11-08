// Dumps genomes and analysis data for a development environment.
// Also dumps a collection

const fs = require('fs');
const argv = require('named-argv');
const mongoConnection = require('utils/mongoConnection');

const Genome = require('models/genome');
const Collection = require('models/collection');
const Analysis = require('models/analysis')

async function main() {
  const { output } = argv.opts;
  if (!output || output == true ) {
    console.log("Expected --output=XXX")
    process.exit(1)
  }

  await mongoConnection.connect();

  const documents = { genomes: [], analyses: [], collections: []}

  const taxids = await Genome.distinct('analysis.speciator.speciesId', { public: true })
  for (let taxid of taxids) {
    documents.genomes.push(await Genome.findOne({'analysis.speciator.speciesId': taxid, public: true }).lean())
  }
  console.log(`Found ${documents.genomes.length} genomes`)

  const collection = await Collection.findOne({ 
    access: "public",
    organismId: "1280",
    token: "gn1lxjtquy8s-harris-et-al-2013" // https://pathogen.watch/collection/gn1lxjtquy8s-harris-et-al-2013
  }).lean()

  documents.collections.push(collection)
  console.log(`Found ${documents.collections.length} collections`)

  const collectionGenomes = await Genome.find({ _id: { $in: collection.genomes }, public: true }).lean()
  documents.genomes.push(...collectionGenomes)
  console.log(`Found ${collectionGenomes.length} genomes`)

  const gonoDocs = await Genome.find({'analysis.speciator.speciesId': "485", public: true }).lean()
  documents.genomes.push(...gonoDocs);
  console.log(`Found ${gonoDocs.length} genomes`)

  const fileIds = new Set(documents.genomes.map(_ => _.fileId))
  const analysisDocs = await Analysis.find({ fileId: { $in: [...fileIds] }}).lean()
  documents.analyses = analysisDocs;
  console.log(`Found ${documents.analyses.length} analyses`)

  const content = JSON.stringify(documents)
  fs.writeFileSync(output, content)
  console.log(`Wrote output to ${output}`)
  return
}

main().catch(err => {
  throw err;
})
