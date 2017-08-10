import * as actions from './actions';
import { FETCH_GENOME_LIST } from '../actions';

const initialState = {
  drawerOpen: false,
  genomes: {},
};

const addToSelection = (memo, { id, name, organismId }) => {
  memo[id] = { id, name, organismId };
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
        genomes: payload.genomes.reduce(addToSelection, { ...state.genomes }),
        drawerOpen: payload.focus,
      };
    }
    case actions.UNSELECT_GENOMES:
      return {
        ...state,
        genomes: payload.genomes.reduce(removeFromSelection, { ...state.genomes }),
      };
    case actions.SET_GENOME_SELECTION: {
      return {
        ...state,
        genomes: payload.genomes.reduce(addToSelection, {}),
      };
    }
    case actions.SELECTION_DRAWER_OPENED:
      return {
        ...state,
        drawerOpen: !state.drawerOpen,
      };
    case FETCH_GENOME_LIST.SUCCESS:
    case FETCH_GENOME_LIST.ERROR:
      return {
        ...state,
        drawerOpen: false,
      };
    default:
      return state;
  }
}
