const fs = require('fs');
const argv = require('named-argv');
const fastaStorage = require('wgsa-fasta-store');
const async = require('async');

const metadataModel = require('models/assemblyMetadata');

const storageConnection = require('utils/storageConnection');
const { ASSEMBLY_METADATA } = require('utils/documentKeys');

const { fastaStoragePath } = require('configuration');
fastaStorage.setup(fastaStoragePath);

const {
  csvFile,
  fastaDir,
} = argv.opts;

async.waterfall([
  next => storageConnection.connect(next),
  next => fs.readFile(csvFile, 'utf8', next),
  (file, next) => {
    const lines = file.split(/\r?\n/g);
    console.log('Num lines:', lines.length - 1);

    const headers = lines[0].split(',').map(_ => _.toLowerCase());
    console.log('Headers:', headers);

    const mainStorage = require('services/storage')('main');

    const rows = lines.slice(1).
      filter(line => line.length > 0).
      map(line => {
        const values = line.split(',');
        return headers.reduce((memo, header, index) => {
          if (header === 'displayname') {
            memo.assemblyName = values[index];
          } else {
            memo[header] = values[index];
          }
          return memo;
        }, {});
      });

    process.chdir(fastaDir);
    async.eachSeries(rows, (row, done) => {
      fastaStorage.store(fastaStoragePath, fs.createReadStream(row.filename))
        .then(({ fileId, metrics, specieator: { taxId } }) => {
          console.log('Checksum:', fileId);
          console.log('Species:', taxId);

          const ids = {
            fileId,
            speciesId: taxId,
            assemblyId: row.uuid,
            collectionId: row.collectionId,
          };
          const metadata = metadataModel.createRecord(ids, row, metrics);

          const key = `${ASSEMBLY_METADATA}_${ids.assemblyId}`;
          console.log('Inserting', key);
          mainStorage.store(key, metadata, error => {
            if (error) done(error);
            console.log('Success:', key);
            done();
          });
        }).
        catch(error => done(error));
    }, next);
  },
], error => {
  if (error) {
    console.error(error);
    process.exit(1);
  } else process.exit(0);
});
