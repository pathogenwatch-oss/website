var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');

describe('Service: Socket', function () {

  it('should connect using the passed-in server and initialise connections',
    function () {
      var socketService = rewire('services/socket');
      var socketIOInstance = {
        sockets: {
          on: sinon.spy()
        }
      };
      var socketIOModule = {
        listen: sinon.stub().returns(socketIOInstance)
      };
      var server = {};

      socketService.__set__('socketio', socketIOModule);

      socketService.connect(server);

      assert(socketIOModule.listen.calledWith(server));
      assert(socketIOInstance.sockets.on.calledWith(
        'connection',
        require('utils/socketConnection').initialise
      ));
    }
  );

  function assertNotification(fnName, args, eventName, message) {
    var socketService = rewire('services/socket');
    var room = {
      emit: sinon.spy()
    };
    var socketIOInstance = {
      sockets: {
        in: sinon.stub().returns(room)
      }
    };
    var ids = args[0];

    socketService.__set__('io', socketIOInstance);

    socketService[fnName].apply(null, args);

    assert(socketIOInstance.sockets.in.calledWith(ids.socketRoomId));
    assert(room.emit.calledWith(eventName, message));
  }

  it('should send an assembly upload notification in the correct format',
    function () {
      var MESSAGE_IDS = {
        socketRoomId: 0,
        collectionId: 1,
        assemblyId: 2,
        userAssemblyId: 3
      };
      var RESULT = 'result';
      var MESSAGE = {
        collectionId: MESSAGE_IDS.collectionId,
        assemblyId: MESSAGE_IDS.assemblyId,
        userAssemblyId: MESSAGE_IDS.userAssemblyId,
        result: RESULT,
        socketRoomId: MESSAGE_IDS.socketRoomId
      };

      assertNotification(
        'notifyAssemblyUpload',
        [MESSAGE_IDS, RESULT],
        'assemblyUploadNotification',
        MESSAGE
      );
    }
  );

  it('should send a collection merge request notification in the right format',
    function () {
      var MESSAGE_IDS = {
        socketRoomId: 0,
        mergedTreeId: 'MERGE_TREE_123'
      };
      var MERGED_TREE = {
        assemblies: [],
        newickTree: {}
      };
      var MERGE_REQUEST = {
        targetCollectionId: 123,
        inputData: {}
      };
      var MESSAGE = {
        mergedCollectionTreeId: '123',
        tree: {
          MERGED: {
            name: 'Merged tree',
            data: MERGED_TREE.newickTree
          }
        },
        assemblies: MERGED_TREE.assemblies,
        targetCollectionId: MERGE_REQUEST.targetCollectionId,
        inputData: MERGE_REQUEST.inputData,
        status: 'MERGE ready',
        result: 'MERGE',
        socketRoomId: MESSAGE_IDS.socketRoomId
      };

      assertNotification(
        'notifyTreeMergeRequest',
        [MESSAGE_IDS, MERGED_TREE, MERGE_REQUEST],
        'collectionTreeMergeNotification',
        MESSAGE
      );
    }
  );

  it('should send a tree merge notification in the correct format',
    function () {
      var MESSAGE_IDS = {
        socketRoomId: 0,
        mergeTreeId: 1
      };
      var MERGE_TREE = {
        assemblies: [],
        newickTree: {}
      };
      var MESSAGE = {
        mergedCollectionTreeId: MESSAGE_IDS.mergeTreeId,
        tree: {
          MERGED: {
            name: 'Merged tree',
            data: MERGE_TREE.newickTree
          }
        },
        assemblies: MERGE_TREE.assemblies,
        result: 'MERGE',
        socketRoomId: MESSAGE_IDS.socketRoomId
      };

      assertNotification(
        'notifyTreeMerge',
        [MESSAGE_IDS, MERGE_TREE],
        'collectionTreeMergeNotification',
        MESSAGE
      );
    }
  );

});
