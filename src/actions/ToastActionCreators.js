const AppDispatcher = require('../dispatcher/AppDispatcher');

export default {
  showToast(toast) {
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
