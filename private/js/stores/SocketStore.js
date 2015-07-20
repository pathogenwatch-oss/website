var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var socketConnection = null;
var roomId = null;

function setSocketConnection(connection) {
  socketConnection = connection;
}

function setRoomId(id) {
  roomId = id;
}

function emitChange() {
  SocketStore.emit(CHANGE_EVENT);
}

var SocketStore = assign({}, EventEmitter.prototype, {

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getSocketConnection: function () {
    return socketConnection;
  },

  getRoomId: function () {
    return roomId;
  }

});

function handleAction(action) {

  switch (action.type) {

    case 'set_socket_connection':

      console.log('action.socketConnection:');
      console.dir(action.socketConnection);

      setSocketConnection(action.socketConnection);
      emitChange();
      break;

    case 'set_room_id':
      setRoomId(action.roomId);
      emitChange();
      break;

    default: // ... do nothing

  }
}

SocketStore.dispatchToken = AppDispatcher.register(handleAction);

module.exports = SocketStore;
