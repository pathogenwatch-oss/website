import {
  ASSEMBLY_PIPELINE_STATUS,
  ASSEMBLY_PROGRESS_TICK,
  ASSEMBLY_PIPELINE_ERROR,
} from './actions';
import { UPLOAD_FETCH_GENOMES } from '../actions';

const initialState = {
  loaded: false,
  status: {},
  tick: undefined,
  errors: {},
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case ASSEMBLY_PIPELINE_STATUS:
      return {
        ...state,
        loaded: true,
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
    case UPLOAD_FETCH_GENOMES.SUCCESS: {
      const errors = {};
      for (const genome of payload.result.genomes) {
        if (genome.assembler && genome.assembler.error) {
          errors[genome.id] = genome.assembler.error;
        }
      }
      return {
        ...state,
        errors,
      };
    }
    default:
      return state;
  }
}
