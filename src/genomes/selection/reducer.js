import { SELECT_GENOMES, UNSELECT_GENOMES, TOGGLE_SELECTED_GENOMES } from './actions';

const initialState = {};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case SELECT_GENOMES:
      return (
        payload.genomes.reduce((memo, { id, name, speciesId }) => {
          memo[id] = { id, name, speciesId };
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
    case TOGGLE_SELECTED_GENOMES:
      return (
        payload.genomes.reduce((memo, { id, name, speciesId }) => {
          if (id in memo) {
            delete memo[id];
          } else {
            memo[id] = { id, name, speciesId };
          }
          return memo;
        }, { ...state })
      );
    default:
      return state;
  }
}
