import { SHOW_GENOME_DETAILS, CLOSE_DRAWER } from './actions';
import { FETCH_GENOME_LIST } from '../genomes/actions';

const initialState = { name: null, genome: null, loading: false, error: false };

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case SHOW_GENOME_DETAILS.ATTEMPT:
      return {
        name: payload.name,
        genome: null,
        loading: true,
      };
    case SHOW_GENOME_DETAILS.SUCCESS:
      return {
        ...state,
        genome: payload.result,
        loading: false,
      };
    case SHOW_GENOME_DETAILS.FAILURE:
      return {
        genome: null,
        loading: false,
        error: true,
      };
    case CLOSE_DRAWER:
    case FETCH_GENOME_LIST.ATTEMPT:
      return initialState;
    default:
      return state;
  }
}
