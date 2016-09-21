import { ADD_FASTAS, CREATE_COLLECTION } from '../actions';

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

export default { fastaOrder, loading };
