/* eslint-disable no-console */
// Dumps FASTAs for a given query on the genomes collection.
const fs = require('fs');
const argv = require('named-argv');
const store = require('utils/object-store');

async function main() {
  const { infile, taxid, outDir = '.' } = argv.opts;
  console.log(infile, taxid);
  if (!infile || !fs.existsSync(infile) || !taxid) {
    console.log("Expected: --infile=[JSON format query on the genomes collection]");
    console.log("Expected: --taxid=[Species]");
    console.log("Optional: --outDir=[Output directory for the cgmlst records. Defaults to the current directory.]");
    process.exit(1);
  }

  const contents = await fs.promises.readFile(infile, { encoding: 'utf8' });

  for (const line of contents.split("\n")) {
    const [ name, checksum ] = line.split(',');
    if (!name || !checksum) continue;
    console.log(`Line: ${line}`);
    const jsonName = `${checksum}-${taxid}.json.gz`;
    if (!fs.existsSync(`${outDir}/${jsonName}`)) {
      try {
        const outStream = fs.createWriteStream(`${outDir}/${name}.json.gz`);
        await store.getAnalysis('cgmlst', '202203171231-v3.0.0', checksum, taxid, { outStream, decompress: false });
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log(`Skipping ${name}`);
    }
  }
}

main().catch((err) => {
  console.log(err);
  process.exit(1);
}).finally(() => console.log("Done"));
