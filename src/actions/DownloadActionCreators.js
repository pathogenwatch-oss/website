import AppDispatcher from '../dispatcher/AppDispatcher';

export default {

  requestFile: function (assembly, idType, fileType) {
    AppDispatcher.dispatch({
      type: 'request_file',
      assembly,
      idType,
      fileType,
    });
  },

};
