import AppDispatcher from '../dispatcher/AppDispatcher';

import ApiUtils from '../utils/Api';

export default {

  fetch(speciesId) {
    ApiUtils.getAntibiotics(speciesId, function (error, antibiotics) {
      if (error) {
        console.error('[WGSA]', error);
        return;
      }

      AppDispatcher.dispatch({
        type: 'set_antibiotics',
        antibiotics,
      });
    });
  },

};
