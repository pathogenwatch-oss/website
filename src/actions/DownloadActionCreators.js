import AppDispatcher from '../dispatcher/AppDispatcher';

export default {

  requestFile(format) {
    AppDispatcher.dispatch({
      type: 'request_file',
      format,
    });
  },

};
