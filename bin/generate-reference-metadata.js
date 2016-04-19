const fs = require('fs');
const path = require('path');

const metadataModel = require('models/assemblyMetadata');
const analyseFasta = require('wgsa_front-end/src/utils/Analysis');

const { ASSEMBLY_METADATA } = require('utils/documentKeys');

const speciesId = process.argv[2];
const filePath = process.argv[3];
const outputPath = process.argv[4];

const inputPath = path.dirname(filePath);

fs.readFile(filePath, 'utf8', (error, file) => {
  if (error) throw error;

  const lines = file.split(/\r?\n/g);
  console.log('Num lines:', lines.length - 1);

  const keys = lines[0].split(',');
  console.log('Keys:', keys);

  lines.slice(1).
    filter(line => line.length > 0).
    map(line => {
      const values = line.split(',');
      return keys.reduce((memo, key, index) => {
        memo[key.toLowerCase()] = values[index];
        return memo;
      }, {});
    }).
    forEach(parsedLine => {
      const ids = {
        assemblyId: `${speciesId}_${parsedLine.filename}`,
        speciesId,
      };
      parsedLine.assemblyName = parsedLine.displayname || parsedLine.filename;

      process.chdir(inputPath);

      const metrics = analyseFasta(
        fs.readFileSync(`${parsedLine.filename}.fasta`, 'utf8')
      );

      const metadata = metadataModel.createRecord(ids, parsedLine, metrics);
      const filename = `${ASSEMBLY_METADATA}_${ids.assemblyId}.json`;
      console.log('Writing file', filename);

      if (outputPath) process.chdir(outputPath);
      fs.writeFileSync(filename, JSON.stringify(metadata));
    });

  process.exit(0);
});
