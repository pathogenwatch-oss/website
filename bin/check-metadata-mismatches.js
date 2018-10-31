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
      cleanRow[key.trim().toLowerCase()] = row[key];
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
  //   const metadataRow = csvRows.find(({ displayname }) => displayname === name);
  //   if (!metadataRow) {
  //     console.error(`Cannot find metadata for genome ${_id}: ${name} in CSV file.`);
  //   }
  //   console.log({ genome, metadataRow });
  // }
  let i = 0;
  console.log();
  for (let index = 0; index < csvRows.length - 19; index++) {
    const csv = csvRows[index];
    const { displayname } = csv;
    const genome = genomes.find(({ name }) => name.trim() === displayname.trim());
    if (!genome) {
      console.error(`Cannot find metadata for genome ${displayname} in CSV file.`);
      console.log({ genome, csv });
      continue;
    }
    const pathogenwatchFields = [ 'displayname', 'name', 'filename', 'year', 'month', 'day', 'latitude', 'longitude', 'pmid' ];
    const userDefined = {};
    for (const key of Object.keys(csv)) {
      if (!pathogenwatchFields.includes(key)) {
        userDefined[key] = csv[key];
      }
    }
    let isMismatch = false;
    const mismatch = { genome: {}, csv: {} };
    if ((genome.name || csv.displayname) && genome.name !== csv.displayname) {
      isMismatch = true;
      mismatch.genome.name = genome.name;
      mismatch.csv.name = csv.name;
    }

    if ((genome.pmid || csv.pmid) && genome.pmid !== csv.pmid) {
      isMismatch = true;
      mismatch.genome.pmid = genome.pmid;
      mismatch.csv.pmid = csv.pmid;
    }

    if ((genome.latitude || csv.latitude) && genome.latitude !== parseFloat(csv.latitude)) {
      isMismatch = true;
      mismatch.genome.latitude = genome.latitude;
      mismatch.csv.latitude = csv.latitude;
    }

    if ((genome.longitude || csv.longitude) && genome.longitude !== parseFloat(csv.longitude)) {
      isMismatch = true;
      mismatch.genome.longitude = genome.longitude;
      mismatch.csv.longitude = csv.longitude;
    }

    if (genome.userDefined || userDefined) {
      for (const key of Object.keys(genome.userDefined)) {
        if (genome.userDefined[key] !== userDefined[key]) {
          isMismatch = true;
          if (!mismatch.genome.userDefined) {
            mismatch.genome.userDefined = {};
          }
          if (!mismatch.csv.userDefined) {
            mismatch.csv.userDefined = {};
          }
          mismatch.genome.userDefined[key] = genome.userDefined[key];
          mismatch.csv.userDefined[key] = userDefined[key];
          break;
        }
      }
      for (const key of Object.keys(userDefined)) {
        if (genome.userDefined[key] !== userDefined[key]) {
          isMismatch = true;
          if (!mismatch.genome.userDefined) {
            mismatch.genome.userDefined = {};
          }
          if (!mismatch.csv.userDefined) {
            mismatch.csv.userDefined = {};
          }
          mismatch.genome.userDefined[key] = genome.userDefined[key];
          mismatch.csv.userDefined[key] = userDefined[key];
          break;
        }
      }
    }

    if (isMismatch) {
      console.log('Mismatch %s', ++i, genome._id, genome.name);
      console.log(mismatch);
      console.log();
      // console.log({ genome, csv });
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
