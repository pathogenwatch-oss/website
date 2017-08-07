import * as actions from './actions';
import { FETCH_GENOMES } from '../actions';

const initialState = {
  drawerOpen: false,
  entities: {},
};

const addToSelection = (memo, { id, name, organismId, metrics }) => {
  memo[id] = { id, name, organismId, metrics };
  return memo;
};

const removeFromSelection = (memo, { id }) => {
  delete memo[id];
  return memo;
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case actions.SELECT_GENOMES: {
      return {
        ...state,
        entities: payload.genomes.reduce(addToSelection, { ...state.entities }),
        drawerOpen: payload.focus,
      };
    }
    case actions.UNSELECT_GENOMES:
      return {
        ...state,
        entities: payload.genomes.reduce(removeFromSelection, { ...state.entities }),
      };
    case actions.SET_GENOME_SELECTION: {
      return {
        ...state,
        entities: payload.genomes.reduce(addToSelection, {}),
      };
    }
    case actions.SELECTION_DRAWER_OPENED:
      return {
        ...state,
        drawerOpen: !state.drawerOpen,
      };
    case FETCH_GENOMES.SUCCESS:
    case FETCH_GENOMES.ERROR:
      return {
        ...state,
        drawerOpen: false,
      };
    default:
      return state;
  }
}
