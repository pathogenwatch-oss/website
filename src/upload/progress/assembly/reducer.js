import { ASSEMBLY_PIPELINE_STATUS, ASSEMBLY_PROGRESS_TICK } from './actions';
import { ADD_GENOMES } from '../../actions';

const initialState = {
  status: {},
  tick: undefined,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case ASSEMBLY_PIPELINE_STATUS:
      return {
        ...state,
        status: payload,
      };

    case ASSEMBLY_PROGRESS_TICK:
      return {
        ...state,
        tick: Date.now(),
      };

    case ADD_GENOMES.ATTEMPT:
      return initialState;

    default:
      return state;
  }
}
