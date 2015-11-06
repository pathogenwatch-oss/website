var fs = require('fs');
var storageConnection = require('utils/storageConnection');

var bucket = process.argv[2];
var documentKey = process.argv[3];
var outputPath = process.argv[4];

storageConnection.connect(function (connError) {
  if (connError) throw connError;
  var mainStorage = require('services/storage')(bucket);
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
