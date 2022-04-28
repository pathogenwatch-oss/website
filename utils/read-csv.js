/* eslint-disable no-console */
const fs = require('fs');
const parse = require('csv-parse/sync');


const systemMetadataColumns = new Set(
  [ 'assemblyId', 'uuid', 'speciesId', 'fileId', 'collectionId',
    'literaturelink', 'filename', 'assemblyname',
    'displayname', 'name', 'date', 'year', 'month', 'day', 'position',
    'latitude', 'longitude',
  ]);

function processRow(row) {
  const processed = { userDefined: {}, year: null, month: null, day: null, literatureLink: null };

  if (!('name' in row) && 'displayname' in row) {
    processed.name = row.displayname;
  }
  if ('literaturelink' in row) {
    processed.literatureLink = row.literaturelink;
    delete row.literaturelink;
  } else if (!('literaturelink' in row) && 'pmid' in row) {
    processed.literatureLink = row.pmid;
    delete row.pmid;
  } else if (!('literaturelink' in row) && !('pmid' in row) && 'doi' in row) {
    processed.literatureLink = row.doi;
    delete row.doi;
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
