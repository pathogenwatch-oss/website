import { FETCH_GENOME_MAP } from '../actions';

export default function (state = [], { type, payload }) {
  switch (type) {
    case FETCH_GENOME_MAP.SUCCESS: {
      return payload.result;
    }
    default:
      return state;
  }
}
