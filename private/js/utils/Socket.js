var io = require('socket.io-client');

function socketConnect() {
  return io.connect('127.0.0.1:8080');
}

module.exports = {
  socketConnect: socketConnect
};
