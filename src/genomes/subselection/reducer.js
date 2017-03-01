import { SELECT_GENOMES, UNSELECT_GENOMES } from './actions';

const initialState = {};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case SELECT_GENOMES:
      return (
        payload.genomes.reduce((memo, { id, name }) => {
          memo[id] = { id, name };
          return memo;
        }, { ...state })
      );
    case UNSELECT_GENOMES:
      return (
        payload.genomes.reduce((memo, { id }) => {
          delete memo[id];
          return memo;
        }, { ...state })
      );
    default:
      return state;
  }
}
