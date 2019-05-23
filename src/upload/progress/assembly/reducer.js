import {
  ASSEMBLY_PIPELINE_STATUS,
  ASSEMBLY_PROGRESS_TICK,
  ASSEMBLY_PIPELINE_ERROR,
} from './actions';

const initialState = {
  status: {},
  tick: undefined,
  errors: {},
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
        tick: payload,
      };

    case ASSEMBLY_PIPELINE_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [payload.id]: payload.error,
        },
      };
    default:
      return state;
  }
}
