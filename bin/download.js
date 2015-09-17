var fs = require('fs');
var path = require('path');
var storageConnection = require('utils/storageConnection');

var documentKey = process.argv[2];
var outputPath = process.argv[3];

storageConnection.connect(function (error) {
  if (error) throw error;
  var mainStorage = require('services/storage')('main');
  mainStorage.retrieve(documentKey, function (error, result) {
    if (error) {
      console.err(error);
      return process.exit(1);
    }
    if (outputPath) {
      process.chdir(outputPath);
    }
    fs.writeFileSync(documentKey + '.json', JSON.stringify(result));
    process.exit(0);
  });
});
