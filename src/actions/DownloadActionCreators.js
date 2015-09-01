import AppDispatcher from '../dispatcher/AppDispatcher';

import Species from '../species';

export default {

  requestFile: function (assembly, idType, fileType) {
    AppDispatcher.dispatch({
      type: 'request_file',
      assembly,
      idType,
      fileType,
      speciesId: Species.id,
    });
  },

};
