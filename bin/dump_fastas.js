/* eslint-disable no-console */
// Dumps FASTAs for a given query on the genomes collection.
const fs = require('fs');
const argv = require('named-argv');
const mongoConnection = require('utils/mongoConnection');

const Genome = require('models/genome');
const store = require('utils/object-store');

async function main() {
  const { query, outDir = '.' } = argv.opts;
  if (!query || query === true) {
    console.log("Expected: --query=[JSON format query on the genomes collection]");
    console.log("Optional: --outDir=[Output directory for the FASTAs. Defaults to the current directory.]");
    process.exit(1);
  }

  const queryJson = JSON.parse(query);
  await mongoConnection.connect();
  const genomes = Genome.collection.find(queryJson);

  for await (const genome of genomes) {
    const { fileId, name } = genome;
    const filename = `${outDir}/${name}.fasta.gz`;
    if (fs.existsSync(`${filename}.gz`)) {
      continue;
    }
    console.log(`${name},${fileId}`);
    const outStream = fs
      .createWriteStream(filename);
    await store.getFasta(fileId, { outStream, decompress: false });
  }
  console.log("Done");

  return mongoConnection.close();
}

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
