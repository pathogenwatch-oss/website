import { SET_GENOME_SELECTION } from '../selection/actions';
import { SET_LASSO_PATH } from './actions';

const initialState = {
  lassoPath: null,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case SET_LASSO_PATH:
      return {
        lassoPath: payload.path,
      };
    case SET_GENOME_SELECTION: {
      if (!payload.genomes.length) {
        return initialState;
      }
      return state;
    }
    default:
      return state;
  }
}
