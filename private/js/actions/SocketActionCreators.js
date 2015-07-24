var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  setSocketConnection: function (socketConnection) {
    var action = {
      type: 'set_socket_connection',
      socketConnection: socketConnection
    };

    AppDispatcher.dispatch(action);
  },

  setRoomId: function (roomId) {
    var action = {
      type: 'set_room_id',
      roomId: roomId
    };

    AppDispatcher.dispatch(action);
  }

};
