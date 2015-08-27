import io from 'socket.io-client';
import CONFIG from '../config';

function socketConnect() {
  return io.connect(CONFIG.api.hostname + ':' + CONFIG.api.port);
}

module.exports = {
  socketConnect: socketConnect,
};
