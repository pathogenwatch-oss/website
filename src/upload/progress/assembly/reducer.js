import { ASSEMBLY_PIPELINE_STATUS, ASSEMBLY_PROGRESS_TICK } from './actions';

const initialState = {
  progress: {},
  tick: null,
};

export default function legacy(state = initialState, { type, payload }) {
  switch (type) {
    case ASSEMBLY_PIPELINE_STATUS:
      return {
        ...state,
        progress: payload,
      };
    case ASSEMBLY_PROGRESS_TICK:
      return {
        ...state,
        tick: Date.now(),
      };
    default:
      return state;
  }
}
