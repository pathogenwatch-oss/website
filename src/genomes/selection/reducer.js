import * as actions from './actions';

const initialState = {};

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
      return (
        payload.genomes.reduce(addToSelection, { ...state })
      );
    }
    case actions.UNSELECT_GENOMES:
      return (
        payload.genomes.reduce(removeFromSelection, { ...state })
      );
    case actions.SET_GENOME_SELECTION: {
      return (
        payload.genomes.reduce(addToSelection, {})
      );
    }
    default:
      return state;
  }
}
