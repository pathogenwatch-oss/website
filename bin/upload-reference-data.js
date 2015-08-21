var fs = require('fs');
var path = require('path');
var storageConnection = require('utils/storageConnection');

var DOCUMENT_PATH = '/home/richard/Desktop/Reference Annotation Data';

storageConnection.connect(function (error) {
  if (error) throw error;
  var mainStorage = require('services/storage')('main');
  fs.readdir(DOCUMENT_PATH, function (err, files) {
    if (err) {
      throw err;
    }

    files.map(function (file) {
      return path.join(DOCUMENT_PATH, file);
    }).filter(function (file) {
      return fs.statSync(file).isFile();
    }).forEach(function (file, i) {
      var string = fs.readFileSync(file, 'utf-8');
      var contents = JSON.parse(string);
      var key = files[i].replace('.txt', '');
      console.log('inserting', key);
      mainStorage.store(key, contents, function (storeError) {
        if (storeError) return console.log(storeError);
        console.log('success:', key);
      });
    });
  });
});
