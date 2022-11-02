/* eslint-disable no-param-reassign,no-console */
const argv = require('named-argv');

const Genome = require('models/genome');
const mongoConnection = require('utils/mongoConnection');
const readCsv = require('../utils/read-csv');
const validateMetadata = require('../universal/validateMetadata');

function checkOpts() {
  const { csvFile } = argv.opts;

  if (!csvFile) {
    console.log('Missing argument(s) (--userId, --csvFile)');
    process.exit(1);
  }
}

function prepareMetadata(metadataUpdate) {
  return metadataUpdate.map((row) => {
    const cleanedRow = row;
    if (!('day' in row) || row.day === '') {
      delete cleanedRow.day;
    }
    if (!('month' in row) || row.month === '') {
      delete cleanedRow.month;
    }
    if (!('year' in row) || row.year === '') {
      delete cleanedRow.year;
    }
    cleanedRow.id = cleanedRow.userDefined.id;
    delete cleanedRow.userDefined.id;
    if ('literatureLink' in row && !!row.literatureLink) {
      cleanedRow.literatureLink = { value: row.literatureLink };
      if (row.literatureLink.value.includes('/')) {
        cleanedRow.literatureLink.type = 'doi';
      } else {
        cleanedRow.literatureLink.type = 'pubmed';
      }
      if (row.doi) cleanedRow.userDefined.doi = row.doi;
      if (row.pmid) cleanedRow.userDefined.pmid = row.pmid;
    } else if (row.pmid) {
      cleanedRow.literatureLink = { value: row.pmid, type: 'pubmed' };
      if (row.doi) cleanedRow.userDefined.doi = row.doi;
    } else if (row.doi) cleanedRow.literatureLink = { value: row.doi, type: 'doi' };
    return cleanedRow;
  });
}

async function main() {
  checkOpts();
  const metadataUpdate = readCsv(argv.opts.csvFile);
  await mongoConnection.connect();
  // const genomes = await fetchGenomes(query);
  const data = prepareMetadata(metadataUpdate);
  validateMetadata(data);
  const lastUpdatedAt = new Date();

  const inserts = data.map((row) => {
    const update = Genome.getMetadataUpdate(row);
    update.lastUpdatedAt = lastUpdatedAt;
    return {
      updateOne: {
        filter: { _id: row.uuid },
        update,
      },
    };
  });
  const result = await Genome.bulkWrite(
    inserts
  ).then((uploadResult) => ({
    matched: uploadResult.matchedCount,
    modified: uploadResult.modifiedCount,
  }));

  console.log(`Matched: ${result.matched} Modified: ${result.modified}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
