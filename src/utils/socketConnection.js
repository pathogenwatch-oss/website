var uuid = require('node-uuid');

var collectionModel = require('models/collection');

var LOGGER = require('utils/logging').createLogger('Socket');

function newRoomId() {
  return uuid.v4();
}

function initialise(socketConnection) {
  var host = socketConnection.handshake.headers.host;
  LOGGER.info('Client connected: ' + host);

  socketConnection.on('disconnect', function () {
    LOGGER.info('Client disconnnected: ' + host);
  });

  socketConnection.on('getRoomId', function () {
    LOGGER.info('Received request for room id from client: ' + host);
    const roomId = newRoomId();
    socketConnection.join(roomId);
    LOGGER.info('Emitting message with room id: ' + host);
    socketConnection.emit('roomId', roomId);
  });

  socketConnection.on('requestIds', function (data) {
    LOGGER.info('Received request for new collection id');
    collectionModel.add(data, function (error, result) {
      if (error) {
        LOGGER.error(error);
        return socketConnection.emit('ids', { error });
      }
      LOGGER.info('Emitting new Ids: ', result);
      socketConnection.emit('ids', { result });
    });
  });
}

module.exports.initialise = initialise;
