import { SHOW_GENOME_REPORT, CLOSE_GENOME_REPORT, REQUEST_CLUSTERING } from './actions';
import { FETCH_GENOME_LIST } from '../actions';

const initialState = {
  name: null,
  genome: null,
  status: null,
  clustering: null,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case SHOW_GENOME_REPORT.ATTEMPT:
      return {
        name: payload.name,
        genome: null,
        status: 'LOADING',
      };
    case SHOW_GENOME_REPORT.SUCCESS:
      return {
        ...state,
        genome: payload.result,
        status: 'READY',
      };
    case SHOW_GENOME_REPORT.FAILURE:
      return {
        genome: null,
        status: 'ERROR',
      };
    case CLOSE_GENOME_REPORT:
    case FETCH_GENOME_LIST.ATTEMPT:
      return initialState;
    case REQUEST_CLUSTERING.ATTEMPT:
      return {
        ...state,
        clustering: 'LOADING',
      };
    case REQUEST_CLUSTERING.SUCCESS:
      return {
        ...state,
        clustering: 'PENDING',
      };
    case REQUEST_CLUSTERING.FAILURE:
      return {
        ...state,
        clustering: 'ERROR',
      };
    default:
      return state;
  }
}
