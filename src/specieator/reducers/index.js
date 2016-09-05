import {
  ADD_FASTAS, CREATE_COLLECTION,
  FILTER_FASTAS, FILTER_BY_SPECIES, CLEAR_FILTER,
} from '../actions';

const fastaOrder = {
  initialState: [],
  actions: {
    [ADD_FASTAS](state, { files }) {
      return [
        ...files.map(_ => _.name),
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
  active: false,
  ids: new Set(),
  speciesId: null,
};

const filter = {
  initialState: initialFilterState,
  actions: {
    [FILTER_FASTAS](state, { active = false, ids }) {
      return {
        ...state,
        active,
        ids: new Set(active ? ids : []),
        speciesId: active ? state.speciesId : null,
      };
    },
    [FILTER_BY_SPECIES](state, { speciesId }) {
      const newSpeciesId = speciesId === state.speciesId ? null : speciesId;
      return {
        ...state,
        speciesId: newSpeciesId,
        active: newSpeciesId !== null,
      };
    },
    [CLEAR_FILTER]() {
      return initialFilterState;
    },
  },
};

export default { fastaOrder, loading, filter };
