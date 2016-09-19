import {
  ADD_FASTAS, CREATE_COLLECTION,
  FILTER_BY_TEXT, FILTER_BY_SPECIES, CLEAR_FILTER,
} from '../actions';

const fastaOrder = {
  initialState: [],
  actions: {
    [ADD_FASTAS](state, { fastas }) {
      return [
        ...fastas.map(_ => _.name),
        ...state,
      ];
    },
  },
};

const loading = {
  initialState: false,
  actions: {
    [CREATE_COLLECTION.ATTEMPT]: () => true,
    [CREATE_COLLECTION.SUCCESS]: () => false,
    [CREATE_COLLECTION.FAILURE]: () => false,
  },
};

const initialFilterState = {
  searchText: '',
  speciesKey: null,
};

const filter = {
  initialState: initialFilterState,
  actions: {
    [FILTER_BY_TEXT](state, { searchText }) {
      return {
        ...state,
        searchText,
      };
    },
    [FILTER_BY_SPECIES](state, { speciesKey }) {
      const newSpeciesKey = speciesKey === state.speciesKey ? null : speciesKey;
      return {
        ...state,
        speciesKey: newSpeciesKey,
      };
    },
    [CLEAR_FILTER]() {
      return initialFilterState;
    },
  },
};

export default { fastaOrder, loading, filter };
