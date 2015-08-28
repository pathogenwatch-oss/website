var fs = require('fs');
var path = require('path');
var storageConnection = require('utils/storageConnection');

storageConnection.connect(function (error) {
  if (error) throw error;
  var mainStorage = require('services/storage')('main');
  mainStorage.retrieve('FP_LIB_1280', function (error, result) {
    console.log(result);
  });
});
