const fs = require('fs');
const path = require('path');
const argv = require('named-argv');
const { promisify } = require('util');

const fastaStorage = require('utils/fasta-store');

const readdirAsync = promisify(fs.readdir);

async function main() {
  const { input } = argv.opts;
  if (!input || input == true ) {
    console.log("Expected --input=XXX (a directory of fastas)")
    process.exit(1)
  }

  const files = await readdirAsync(input);
  const nFiles = files.length;
  let errors = 0;
  for (let i=0; i<nFiles; i++) {
    const file = files[i];
    try {
      const { fileId } = await fastaStorage.store(fs.createReadStream(path.join(input, file)), 100)
      console.error(`Loaded ${i}/${nFiles} ${file} ${fileId}`)
    } catch (err) {
      errors++
      console.error(`Error loading ${i}/${nFiles} ${file} (${errors} errors)`)
    }
  }
}

main().catch(err => {
  console.log(err);
  process.exit(1);
})