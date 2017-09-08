/* eslint no-param-reassign: 0 */
/* eslint max-len: 0 */
/* eslint no-console: 0 */

const argv = require('named-argv');
const fs = require('fs');
const papaparse = require('papaparse');

const mongoConnection = require('../src/utils/mongoConnection');
const Genome = require('../src/models/genome');

function getArguments() {
  const { csv } = argv.opts;
  if (csv) {
    return { csv };
  }
  throw new Error('Missing args');
}

function getMetadata(csvFilePath, delimiter = '', newline = '') {
  const csv = fs.readFileSync(csvFilePath, 'utf8');
  const { data } = papaparse.parse(csv, {
    delimiter,
    newline,
    header: true,
    dynamicTyping: false,
    skipEmptyLines: true,
  });
  const cleanData = data.map(row => {
    const cleanRow = {};
    for (const key of Object.keys(row)) {
      cleanRow[key.trim()] = row[key].trim();
    }
    return cleanRow;
  });
  return Promise.resolve(cleanData);
}

function getGenomes() {
  const query = {
    organismId: '90370',
    public: true,
    // reference: false,
  };
  return (
    Genome.find(query).lean()
  );
}

function getMetadataAndGenomes({ csv }) {
  return Promise.all([
    getMetadata(csv),
    getGenomes(),
  ]);
}

function checkGenomeMetadata([ csvRows, genomes ]) {
  // for (const genome of genomes) {
  //   const { _id, name } = genome;
  //   const metadataRow = csvRows.find(({ DisplayName }) => DisplayName === name);
  //   if (!metadataRow) {
  //     console.error(`Cannot find metadata for genome ${_id}: ${name} in CSV file.`);
  //   }
  //   console.log({ genome, metadataRow });
  // }

  for (let index = 0; index < csvRows.length - 19; index++) {
    const metadataRow = csvRows[index];
    // const { DisplayName } = metadataRow;
    const genome = genomes.find(({ name }) => name.trim() === metadataRow.DisplayName);
    if (!genome) {
      console.error(`Cannot find metadata for genome ${metadataRow.DisplayName} in CSV file.`);
      console.log({ genome, metadataRow });
    }
  }

  return [ csvRows, genomes ];
}

mongoConnection.connect()
  .then(getArguments)
  .then(getMetadataAndGenomes)
  .then(checkGenomeMetadata)
  .then(() => { console.log('Done'); process.exit(0); })
  .catch(error => { console.error(error); process.exit(1); });
