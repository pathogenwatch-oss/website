import AppDispatcher from '../dispatcher/AppDispatcher';

import FilteredDataUtils from '../utils/FilteredData';
import Species from '../species';

export default {

  requestFile(format, id = FilteredDataUtils.getDownloadIdList(format)) {
    AppDispatcher.dispatch({
      type: 'request_file',
      id,
      format,
      speciesId: Species.id,
    });
  },

};
