var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');

describe('Util: Storage Connection', function () {
  var BUCKET_NAME = 'test';

  it('should attempt to connect with the provided config', function () {
    var storageUtil = rewire('utils/storageConnection');
    var config = {
      server: {
        couchbase: {
          buckets: {}
        }
      }
    };
    config.server.couchbase.buckets[BUCKET_NAME] = {
      name: 'user',
      password: 'pass'
    };
    var bucket = {};

    var createBucketConnection = sinon.stub().returns(bucket);
    storageUtil.__set__('createBucketConnection', createBucketConnection);

    storageUtil.connect(config, function () {
      assert(createBucketConnection.calledWith(config[BUCKET_NAME]));
      assert(storageUtil.getConnections().hasOwnProperty(BUCKET_NAME));
    });
  });

});
