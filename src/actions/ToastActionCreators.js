var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {
  fireToast: function(data) {
    var action = {
      type: 'show_toast',
      data: data
    };
    AppDispatcher.dispatch(action);
  },

  hideToast: function() {
    var action = {
      type: 'hide_toast'
    };
    AppDispatcher.dispatch(action);
  }
}