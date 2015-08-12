var io = require('socket.io-client');
var CONFIG = require('../../../config.json').client;

function socketConnect() {
  return io.connect(CONFIG.api.hostname + ':' + CONFIG.api.port);
}

module.exports = {
  socketConnect: socketConnect
};
