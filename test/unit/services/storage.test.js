var assert = require('assert');
var sinon = require('sinon');
var extend = require('extend');

describe('Service: Storage', function () {

  var CONNECTION_NAME = 'main';
  var COUCHBASE_RESULT = { value: 'result', cas: 'cas' };

  var mockSuccessConnection = {
    get: sinon.stub().yields(null, COUCHBASE_RESULT),
    upsert: sinon.stub().yields(null, COUCHBASE_RESULT),
  };

  var mockErrorConnection = {
    get: sinon.stub().yields(new Error('get error'), null),
    upsert: sinon.stub().yields(new Error('set error'), null),
  };

  it('should create the required connections', function () {
    var storageService = require('services/storage');

    assert(storageService('main') !== null);
    assert(storageService('resources') !== null);
    assert(storageService('feedback') !== null);
  });

  it('should return the value property of a `get` result', function (done) {
    var storageService = require('services/storage');

    var storage = storageService(CONNECTION_NAME);
    storage.connection = mockSuccessConnection;

    storage.retrieve('key', function (error, result) {
      assert(mockSuccessConnection.get.calledWith('key'));
      assert.equal(result, COUCHBASE_RESULT.value);
      done();
    });
  });

  it('should surface `get` errors', function (done) {
    var storageService = require('services/storage');

    var storage = storageService(CONNECTION_NAME);
    storage.connection = mockErrorConnection;

    storage.retrieve('key', function (error) {
      assert.equal(error.message, 'get error');
      done();
    });
  });

  it('should return the cas property of a `set` result', function (done) {
    var storageService = require('services/storage');

    var storage = storageService(CONNECTION_NAME);
    storage.connection = mockSuccessConnection;

    storage.store('key', 'value', function (error, result) {
      assert(mockSuccessConnection.upsert.calledWith('key', 'value'));
      assert.equal(result, COUCHBASE_RESULT.cas);
      done();
    });
  });

  it('should surface `set` errors', function (done) {
    var storageService = require('services/storage');

    var storage = storageService(CONNECTION_NAME);
    storage.connection = mockErrorConnection;

    storage.store('key', 'value', function (error) {
      assert.equal(error.message, 'set error');
      done();
    });
  });

  describe('Batch Operations', function () {

    var COUCHBASE_MULTI_QUERY = [ 'one', 'two' ];
    var COUCHBASE_MULTI_RESULT = {
      one: { value: 'result one' },
      two: { value: 'result two' },
    };
    var COUCHBASE_MULTI_ERROR = {
      one: { error: new Error('one not found') },
      two: { error: new Error('two not found') },
    };

    var mockSuccessConnection = {
      getMulti: sinon.stub().yields(null, COUCHBASE_MULTI_RESULT),
    };

    var mockErrorConnection = {
      getMulti: sinon.stub().yields(2, COUCHBASE_MULTI_ERROR),
    };

    it('should return multiple values from a batch operation', function (done) {
      var storageService = require('services/storage');

      var storage = storageService(CONNECTION_NAME);
      storage.connection = mockSuccessConnection;

      storage.retrieveMany(COUCHBASE_MULTI_QUERY, function (error, result) {
        assert(mockSuccessConnection.getMulti.calledWith(
          COUCHBASE_MULTI_QUERY
        ));
        assert(sinon.match(result, {
          one: COUCHBASE_MULTI_RESULT.one.value,
          two: COUCHBASE_MULTI_RESULT.two.value,
        }));
        done();
      });
    });

    it('should return the keys of the errored documents', function (done) {
      var storageService = require('services/storage');

      var storage = storageService(CONNECTION_NAME);
      storage.connection = mockErrorConnection;

      storage.retrieveMany(COUCHBASE_MULTI_QUERY, function (erroredKeys) {
        assert(
          sinon.match(erroredKeys, Object.keys(COUCHBASE_MULTI_ERROR))
        );
        done();
      });
    });

  });

});
