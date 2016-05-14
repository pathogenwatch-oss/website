const fs = require('fs');
const argv = require('named-argv');

const metadataModel = require('models/assemblyMetadata');
const analyseFasta = require('wgsa_front-end/universal/fastaAnalysis');

const { ASSEMBLY_METADATA } = require('utils/documentKeys');

const {
  speciesId,
  csvFile,
  fastaDir,
  outputDir = process.cwd(),
} = argv.opts;

fs.readFile(csvFile, 'utf8', (error, file) => {
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

      process.chdir(fastaDir);
      const metrics = analyseFasta(
        fs.readFileSync(`${parsedLine.filename}.fasta`, 'utf8')
      );

      const metadata = metadataModel.createRecord(ids, parsedLine, metrics);
      const filename = `${ASSEMBLY_METADATA}_${ids.assemblyId}.json`;
      console.log('Writing file', filename);

      if (outputDir) process.chdir(outputDir);
      fs.writeFileSync(filename, JSON.stringify(metadata));
    });

  process.exit(0);
});
