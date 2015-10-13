import AppDispatcher from '../dispatcher/AppDispatcher';

import Species from '../species';

export default {

  requestFile: function (format) {
    AppDispatcher.dispatch({
      type: 'request_file',
      format,
      speciesId: Species.id,
    });
  },

};
