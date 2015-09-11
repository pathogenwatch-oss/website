var socketio = require('socket.io');

var socketConnection = require('utils/socketConnection');

var LOGGER = require('utils/logging').createLogger('Socket');

var io; // module-wide variable because initialisation and usage are separate
function connect(server) {
  io = socketio.listen(server);
  // io.set('origins', '*');
  io.sockets.on('connection', socketConnection.initialise);
}

function notifyAssemblyUpload(ids, result) {
  LOGGER.info(
    'Emitting ' + result + ' message for socketRoomId: ' + ids.socketRoomId
  );

  io.sockets.in(ids.socketRoomId).emit('assemblyUploadNotification', {
    collectionId: ids.collectionId,
    assemblyId: ids.assemblyId,
    assemblyName: ids.assemblyName,
    result: result,
    socketRoomId: ids.socketRoomId
  });
}

function notifyCollectionUpload(ids, result) {
  LOGGER.info(
    'Emitting ' + result + ' message for socketRoomId: ' + ids.socketRoomId
  );

  io.sockets.in(ids.socketRoomId).emit('assemblyUploadNotification', {
    collectionId: ids.collectionId,
    result: result,
    socketRoomId: ids.socketRoomId
  });
}

function wrapNewickTreeData(newickTree) {
  return {
    MERGED: {
      name: 'Merged tree',
      data: newickTree
    }
  };
}

function notifyTreeMergeRequest(ids, mergedTree, mergeRequest) {
  io.sockets.in(ids.socketRoomId).emit('collectionTreeMergeNotification', {
    mergedCollectionTreeId: ids.mergedTreeId.replace('MERGE_TREE_', ''),
    tree: wrapNewickTreeData(mergedTree.newickTree),
    assemblies: mergedTree.assemblies,
    targetCollectionId: mergeRequest.targetCollectionId,
    inputData: mergeRequest.inputData,
    status: 'MERGE ready',
    result: 'MERGE',
    socketRoomId: ids.socketRoomId
  });
}

function notifyTreeMerge(ids, mergeTree) {
  var mergeTreeId = ids.mergeTreeId;
  var socketRoomId = ids.socketRoomId;

  LOGGER.info('Emitting MERGE_TREE message for socketRoomId: ' + socketRoomId);
  io.sockets.in(ids.socketRoomId).emit('collectionTreeMergeNotification', {
    mergedCollectionTreeId: mergeTreeId,
    tree: wrapNewickTreeData(mergeTree.newickTree),
    assemblies: mergeTree.assemblies,
    result: 'MERGE',
    socketRoomId: socketRoomId
  });
}

module.exports.connect = connect;
module.exports.notifyAssemblyUpload = notifyAssemblyUpload;
module.exports.notifyCollectionUpload = notifyCollectionUpload;
module.exports.notifyTreeMergeRequest = notifyTreeMergeRequest;
module.exports.notifyTreeMerge = notifyTreeMerge;
