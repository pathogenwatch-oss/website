var fs = require('fs');
var path = require('path');
var async = require('async');

var storageConnection = require('utils/storageConnection');

var DOCUMENT_PATH = process.argv[2];

async.waterfall([
  function (next) {
    storageConnection.connect(next);
  },
  function (next) {
    fs.readdir(DOCUMENT_PATH, next);
  },
  function (files, next) {
    var filesToProcess = files.map(function (file) {
      return path.join(DOCUMENT_PATH, file);
    }).filter(function (file) {
      return fs.statSync(file).isFile();
    });

    var mainStorage = require('services/storage')('main');
    async.eachSeries(filesToProcess, function (file, done) {
      var string = fs.readFileSync(file, 'utf-8');
      var contents = JSON.parse(string);
      var key = path.basename(file).replace(path.extname(file), '');
      console.log('inserting', key);
      mainStorage.store(key, contents, function (storeError) {
        if (storeError) done(storeError)
        console.log('success:', key);
        done();
      });
    }, next);
  }
], function (error) {
  if (error) {
    console.err(error);
    return process.exit(1);
  }
  process.exit(0);
});
