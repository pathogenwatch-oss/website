var uuid = require('node-uuid');

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
    var roomId = newRoomId();
    socketConnection.join(roomId);
    LOGGER.info('Emitting message with room id: ' + host);
    socketConnection.emit('roomId', roomId);
  });
}

module.exports.initialise = initialise;
