const promisify = require('promisify-node');
const fs = promisify('fs');

const systemMetadataColumns = new Set([
  'assemblyId', 'uuid', 'speciesId', 'fileId', 'collectionId', 'pmid',
  'filename', 'assemblyname', 'displayname', 'name',
  'date', 'year', 'month', 'day',
  'position', 'latitude', 'longitude',
]);

function parseRows(file) {
  const lines = file.split(/\r?\n/g);
  console.log('Num lines:', lines.length - 1);

  const headers = lines[0].split(',').map(_ => _.toLowerCase());
  console.log('Headers:', headers);

  return lines.slice(1)
    .filter(line => line.length > 0)
    .map(line => {
      const values = line.split(',');
      return headers.reduce((memo, header, index) => {
        const value = values[index];
        if (header === 'displayname') {
          memo.name = value;
        } else if (systemMetadataColumns.has(header)) {
          memo[header] = value;
        } else {
          memo.userDefined[header] = value;
        }
        return memo;
      }, { userDefined: {}, year: null, month: null, day: null, pmid: null });
    });
}

module.exports = function (csvFilePath) {
  return (
    fs.readFile(csvFilePath, 'utf8')
      .then(parseRows)
  );
};
