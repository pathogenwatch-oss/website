var async = require('async');

var registerCollection = require('./features/register-collection');
var connectWsClient = require('./features/ws-client');
var uploadAssembly = require('./features/upload-assembly');

describe('Full Upload Test', function () {

  it('should complete a full upload', function (done) {
    var assemblyFilenames = [ 'JH1.fna', 'JH9.fa', 'MW2.fna' ];

    registerCollection(assemblyFilenames)
      .end(function (err, res) {

      });
  });

});
