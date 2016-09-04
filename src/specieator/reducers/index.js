import { ADD_FASTAS } from '../actions';
import { CREATE_COLLECTION, FILTER_FASTAS } from '../thunks';

import { getFastas } from './fastas';

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

export const getFastaOrder = state => state.specieator.fastaOrder;

export const getOrderedFastas = state => {
  const fastas = getFastas(state);
  return getFastaOrder(state).map(name => fastas[name]);
};


const loading = {
  initialState: false,
  actions: {
    [CREATE_COLLECTION.ATTEMPT]: () => true,
    [CREATE_COLLECTION.SUCCESS]: () => false,
    [CREATE_COLLECTION.FAILURE]: () => false,
  },
};


const filter = {
  initialState: { active: false, ids: new Set() },
  actions: {
    [FILTER_FASTAS](state, { active = false, ids }) {
      return {
        active,
        ids: new Set(active ? ids : []),
      };
    },
  },
};

export const isFilterActive = ({ specieator }) => specieator.filter.active;
export const getFilterIds = ({ specieator }) => specieator.filter.ids;

export const getVisibleFastas = state => {
  const filterIds = getFilterIds(state);
  const fastas = getOrderedFastas(state);

  return (
    isFilterActive(state) ?
      fastas.filter(({ name }) => filterIds.has(name)) :
      fastas
  );
};


export default { fastaOrder, loading, filter };
