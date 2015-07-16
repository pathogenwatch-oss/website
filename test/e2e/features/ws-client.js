var wsClient = require('socket.io-client');

module.exports = function (callback) {
  var socket = wsClient('http://localhost:3000');

  socket.on('connect', function () {
    socket.emit('getRoomId');
  });

  socket.on('roomId', callback.bind(socket));
};
