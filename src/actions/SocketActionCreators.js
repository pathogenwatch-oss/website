import AppDispatcher from '../dispatcher/AppDispatcher';

module.exports = {

  setSocketConnection: function (socketConnection) {
    const action = {
      type: 'set_socket_connection',
      socketConnection,
    };

    AppDispatcher.dispatch(action);
  },

};
