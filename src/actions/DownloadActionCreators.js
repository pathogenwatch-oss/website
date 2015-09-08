import AppDispatcher from '../dispatcher/AppDispatcher';

import Species from '../species';

export default {

  requestFile: function (id, idType, fileType) {
    AppDispatcher.dispatch({
      type: 'request_file',
      id,
      idType,
      fileType,
      speciesId: Species.id,
    });
  },

};
