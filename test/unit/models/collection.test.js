var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');

describe('Model: Collection', function () {

  it.skip('should use the message queue to add a collection', function (done) {
    var collectionModel = rewire('models/collection');

    var exchange = { publish: sinon.spy() };
    var MESSAGE = {
      uuid: '123',
      idMap: {},
    };
    var queue = { name: 'NAME', subscribe: sinon.stub().yieldsAsync(null, MESSAGE), destroy: sinon.spy() };
    var messageQueueService = {
      getCollectionIdExchange: sinon.stub().returns(exchange),
      newCollectionAddQueue: sinon.stub().yields(queue),
    };

    collectionModel.__set__('messageQueueService', messageQueueService);

    var requestBody = { collectionId: '123', assemblyNames: [ '456', '789' ] };
    collectionModel.add('1280', requestBody, function (error, result) {
      assert(exchange.publish.calledWith('id-request', {
        taskId: requestBody.collectionId,
        inputData: requestBody.assemblyNames,
      }, { replyTo: queue.name }));
      assert(sinon.match(result, {
        collectionId: MESSAGE.uuid,
        assemblyNameToAssemblyIdMap: MESSAGE.idMap,
      }));
      done();
    }
    );
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
