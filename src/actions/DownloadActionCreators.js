import AppDispatcher from '../dispatcher/AppDispatcher';

import FilteredDataUtils from '../utils/FilteredData';
import Species from '../species';

export default {

  requestFile: function (format) {
    AppDispatcher.dispatch({
      type: 'request_file',
      idList: FilteredDataUtils.getDownloadIdList(format),
      format,
      speciesId: Species.id,
    });
  },

};
