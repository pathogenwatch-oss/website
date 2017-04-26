import * as actions from './actions';

import { isOverSelectionLimit } from './utils';

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
      const nextSelectionSize = payload.genomes.length + Object.keys(state).length;
      if (isOverSelectionLimit(nextSelectionSize)) {
        return state;
      }
      return (
        payload.genomes.reduce(addToSelection, { ...state })
      );
    }
    case actions.UNSELECT_GENOMES:
      return (
        payload.genomes.reduce(removeFromSelection, { ...state })
      );
    case actions.SET_GENOME_SELECTION: {
      if (isOverSelectionLimit(payload.genomes.length)) {
        return state;
      }
      return (
        payload.genomes.reduce(addToSelection, {})
      );
    }
    default:
      return state;
  }
}
