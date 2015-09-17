import AppDispatcher from '../dispatcher/AppDispatcher';

import Species from '../species';

export default {

  requestFile: function (id, fileType) {
    AppDispatcher.dispatch({
      type: 'request_file',
      id,
      fileType,
      speciesId: Species.id,
    });
  },

};
