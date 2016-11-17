const fs = require('fs');
const path = require('path');
const async = require('async');

const storageConnection = require('utils/storageConnection');

const DOCUMENT_PATH = process.argv[2];

async.waterfall([
  next => storageConnection.connect(next),
  next => fs.readdir(DOCUMENT_PATH, next),
  (files, next) => {
    const filesToProcess =
      files.
        map(filename => path.join(DOCUMENT_PATH, filename)).
        filter(file => fs.statSync(file).isFile());

    const mainStorage = require('services/storage')('main');
    async.eachSeries(filesToProcess, (file, done) => {
      const string = fs.readFileSync(file, 'utf-8');
      const contents = JSON.parse(string);
      const key = path.basename(file).replace(path.extname(file), '');
      console.log('inserting', key);
      mainStorage.store(key, contents, storeError => {
        if (storeError) done(storeError);
        console.log('success:', key);
        done();
      });
    }, next);
  },
], error => {
  if (error) {
    console.error(error);
    return process.exit(1);
  }
  return process.exit(0);
});
