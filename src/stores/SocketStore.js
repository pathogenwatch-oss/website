import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

const CHANGE_EVENT = 'change';

let socketConnection = null;
let roomId = null;

function setSocketConnection(connection) {
  socketConnection = connection;
}

function setRoomId(id) {
  roomId = id;
}

const SocketStore = assign({}, EventEmitter.prototype, {

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getSocketConnection() {
    return socketConnection;
  },

  getRoomId() {
    return roomId;
  },

});

function emitChange() {
  SocketStore.emit(CHANGE_EVENT);
}

function handleAction(action) {
  switch (action.type) {

  case 'set_socket_connection':
    setSocketConnection(action.socketConnection);
    emitChange();
    break;

  case 'set_room_id':
    setRoomId(action.roomId);
    emitChange();
    break;

  default:
    // ... do nothing

  }
}

SocketStore.dispatchToken = AppDispatcher.register(handleAction);

export default SocketStore;
