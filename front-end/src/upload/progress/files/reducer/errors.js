import { PROCESS_GENOME } from '../actions';

export default function (state = {}, { type, payload }) {
  switch (type) {
    case PROCESS_GENOME.FAILURE:
      return {
        ...state,
        [payload.id]: payload.error,
      };
    default:
      return state;
  }
}
