import { SHOW_GENOME_REPORT, CLOSE_GENOME_REPORT } from './actions';
import { FETCH_GENOME_LIST } from '../actions';

const initialState = { name: null, genome: null, loading: false, error: false };

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case SHOW_GENOME_REPORT.ATTEMPT:
      return {
        name: payload.name,
        genome: null,
        loading: true,
      };
    case SHOW_GENOME_REPORT.SUCCESS:
      return {
        ...state,
        genome: payload.result,
        loading: false,
      };
    case SHOW_GENOME_REPORT.FAILURE:
      return {
        genome: null,
        loading: false,
        error: true,
      };
    case CLOSE_GENOME_REPORT:
    case FETCH_GENOME_LIST.ATTEMPT:
      return initialState;
    default:
      return state;
  }
}
