/* eslint-disable no-console */
const fs = require('fs');
const parse = require('csv-parse/sync');


const systemMetadataColumns = new Set([
  'assemblyId', 'uuid', 'speciesId', 'fileId', 'collectionId', 'pmid',
  'filename', 'assemblyname', 'displayname', 'name',
  'date', 'year', 'month', 'day',
  'position', 'latitude', 'longitude',
]);

function processRow(row) {
  const processed = { userDefined: {}, year: null, month: null, day: null, pmid: null };

  if (!('name' in row) && 'displayname' in row) {
    processed.name = row.displayname;
  }
  for (const field of Object.keys(row)) {
    if (systemMetadataColumns.has(field)) {
      processed[field] = row[field];
    } else {
      processed.userDefined[field] = row[field];
    }
  }
  return processed;
}

module.exports = function (csvFilePath) {
  const fileContent = fs.readFileSync(csvFilePath);
  const records = parse.parse(fileContent,
    { columns: true }
  );
  return records.map(processRow);
};
