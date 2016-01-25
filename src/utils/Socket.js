import io from 'socket.io-client';
import CONFIG from '../config';

const options = {
  transports: [ 'websocket' ],
};

function socketConnect() {
  if (CONFIG.api) {
    // no options here to allow dev mode to use long-polling
    return io.connect(CONFIG.api.address, options);
  }
  return io.connect(options);
}

module.exports = {
  socketConnect: socketConnect,
};
