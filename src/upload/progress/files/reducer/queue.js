import * as actions from '../actions';
import { UPLOAD_ADD_GENOMES } from '../../../actions';

const initialState = {
  processing: new Set(),
  pending: [],
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case UPLOAD_ADD_GENOMES.SUCCESS: {
      const pending = [];
      for (const genome of payload.genomes) {
        pending.push(genome.id);
      }
      return {
        ...initialState,
        pending,
      };
    }

    case actions.PROCESS_GENOME.ATTEMPT:
      return {
        ...state,
        pending: state.pending.slice(1),
        processing: new Set([ ...state.processing, payload.id ]),
      };

    case actions.PROCESS_GENOME.SUCCESS:
    case actions.PROCESS_GENOME.FAILURE: {
      const processing = new Set(state.processing);
      processing.delete(payload.id);
      return {
        ...state,
        processing,
      };
    }

    default:
      return state;
  }
}
