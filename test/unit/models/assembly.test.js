var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');

describe('Model: Assembly', function () {

  it('should get an assembly from storage by id', function () {
    var assemblyModel = rewire('models/assembly');
    var mockMainStorage = {
      retrieve: sinon.spy()
    };
    var reset = assemblyModel.__set__('mainStorage', mockMainStorage);

    assemblyModel.get('123');

    assert(mockMainStorage.retrieve.calledWith('123'));
    reset();
  });

  it('should return projected table data', function (done) {
    var assemblyModel = rewire('models/assembly');
    var ASSEMBLY_ID = '123';
    var COUCHBASE_RESULT = {};
    COUCHBASE_RESULT[ASSEMBLY_ID] = {
      value: {
        assemblyId: '123',
        completeAlleles: [],
        somethingElse: []
      }
    };
    var mockMainStorage = {
      retrieveMany: sinon.stub().yields(null, COUCHBASE_RESULT)
    };
    var reset = assemblyModel.__set__('mainStorage', mockMainStorage);

    assemblyModel.getTableData([ASSEMBLY_ID], function (error, result) {
      var value = result[ASSEMBLY_ID];

      assert.equal(error, null);
      assert.equal(Object.keys(value).length, 2);
      assert(value.hasOwnProperty('assemblyId'));
      assert(value.hasOwnProperty('completeAlleles'));

      reset();
      done();
    });

  });

  it('should get assembly metadata from storage by id', function () {
    var assemblyModel = rewire('models/assembly');
    var mockMainStorage = {
      retrieve: sinon.spy()
    };
    var reset = assemblyModel.__set__('mainStorage', mockMainStorage);

    assemblyModel.getMetadata('123');

    assert(mockMainStorage.retrieve.calledWith('ASSEMBLY_METADATA_123'));
    reset();
  });

});
