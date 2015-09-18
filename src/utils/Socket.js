import io from 'socket.io-client';
import CONFIG from '../config';

function socketConnect() {
  if (CONFIG.api) {
    return io.connect(CONFIG.api.hostname + ':' + CONFIG.api.port);
  }
  return io.connect();
}

module.exports = {
  socketConnect: socketConnect,
};
