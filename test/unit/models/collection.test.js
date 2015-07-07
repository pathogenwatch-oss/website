var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');

describe('Model: Collection', function () {

  it('should use the message queue to add a collection', function (done) {
    var collectionModel = rewire('models/collection');

    var exchange = { publish: sinon.spy() };
    var MESSAGE = {
      uuid: '123',
      idMap: {}
    };
    var queue = { name: 'NAME', subscribe: sinon.stub().yieldsAsync(null, MESSAGE) };
    var messageQueueService = {
      getCollectionIdExchange: sinon.stub().returns(exchange),
      newCollectionAddQueue: sinon.stub().yields(queue)
    };

    collectionModel.__set__('messageQueueService', messageQueueService);

    var requestBody = { collectionId: '123', userAssemblyIds: [] };
    collectionModel.add(
      requestBody.collectionId,
      requestBody.userAssemblyIds,
      function (error, result) {
        assert(exchange.publish.calledWith('id-request', {
          taskId: requestBody.collectionId,
          inputData: requestBody.userAssemblyIds
        }, { replyTo: queue.name }));
        assert(sinon.match(result, {
          collectionId: MESSAGE.uuid,
          userAssemblyIdToAssemblyIdMap: MESSAGE.idMap
        }));
        done();
      }
    );
  });

  it('should get the representative collection', function (done) {
    var collectionModel = rewire('models/collection');

    var resourceStorage = { retrieve: sinon.stub().yields(null, {}) };
    collectionModel.__set__('resourceStorage', resourceStorage);

    collectionModel.getRepresentativeCollection(function () {
      assert(resourceStorage.retrieve.calledWith(
        'REP_METADATA_1280'
      ));
      done();
    });
  });

  it('should handle a non-existing collection', function (done) {
    var collectionModel = rewire('models/collection');

    var mainStorage = { retrieve: sinon.stub().yields(new Error(), null) };
    var antibioticModel = { getAll: sinon.stub().yields() };
    collectionModel.__set__('mainStorage', mainStorage);
    collectionModel.__set__('getTree', sinon.stub().yields());
    collectionModel.__set__('antibioticModel', antibioticModel);

    collectionModel.get('non-existing-key', function (error) {
      assert(error !== null);
      done();
    });
  });

});
