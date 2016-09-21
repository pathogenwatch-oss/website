import {
  FILTER_BY_TEXT, FILTER_BY_METADATA, CLEAR_FILTER,
} from '../actions';

import { metadataFilters } from '../utils/filter';

const initialState = {
  searchText: '',
  ...metadataFilters.reduce((memo, { key }) => ({ ...memo, [key]: null }), {}),
};

export default {
  initialState,
  actions: {
    [FILTER_BY_TEXT](state, { searchText }) {
      return {
        ...state,
        searchText,
      };
    },
    [FILTER_BY_METADATA](state, { key, value }) {
      const newValue = value === state[key] ? null : value;
      return {
        ...state,
        [key]: newValue,
      };
    },
    [CLEAR_FILTER]() {
      return initialState;
    },
  },
};
