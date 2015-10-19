const AppDispatcher = require('../dispatcher/AppDispatcher');

export default {
  fireToast(toast) {
    AppDispatcher.dispatch({
      type: 'show_toast',
      toast,
    });
  },

  hideToast() {
    AppDispatcher.dispatch({
      type: 'hide_toast',
    });
  },
};
