import { SHOW_GENOME_REPORT, CLOSE_GENOME_REPORT } from './actions';
import { FETCH_GENOME_LIST } from '../genomes/actions';
import { LOCATION_CHANGE } from '../location';

const initialState = {
  name: null,
  genome: null,
  status: null,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case SHOW_GENOME_REPORT.ATTEMPT:
      return {
        ...initialState,
        name: payload.name,
        status: 'LOADING',
      };
    case SHOW_GENOME_REPORT.SUCCESS: {
      const genome = payload.result;
      return {
        ...state,
        genome,
        status: 'READY',
      };
    }
    case SHOW_GENOME_REPORT.FAILURE:
      return {
        genome: null,
        status: 'ERROR',
      };
    case CLOSE_GENOME_REPORT:
    case FETCH_GENOME_LIST.ATTEMPT:
    case LOCATION_CHANGE:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
