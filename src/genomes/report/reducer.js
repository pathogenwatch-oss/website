import { SHOW_GENOME_REPORT, CLOSE_GENOME_REPORT, REQUEST_CLUSTERING, UPDATE_CLUSTERING_PROGRESS, FETCH_CLUSTERS } from './actions';
import { FETCH_GENOME_LIST } from '../actions';
import { LOCATION_CHANGE } from '../../location';

const initialState = {
  name: null,
  genome: null,
  status: null,
  clusteringStatus: null,
  clusteringProgress: null,
  clusters: null,
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
        clusteringStatus: 'LOADING',
        clusteringProgress: 0.0,
      };
    case REQUEST_CLUSTERING.SUCCESS: {
      const { statusCode } = payload.result;
      if (statusCode === 304) {
        return {
          ...state,
          clusteringStatus: 'READY',
        };
      }
      return {
        ...state,
        clusteringStatus: 'PENDING',
      };
    }
    case REQUEST_CLUSTERING.FAILURE:
      return {
        ...state,
        clusteringStatus: 'ERROR',
      };
    case UPDATE_CLUSTERING_PROGRESS: {
      const { status, progress = state.clusteringProgress } = payload;
      return {
        ...state,
        clusteringStatus: status,
        clusteringProgress: progress,
      };
    }
    case FETCH_CLUSTERS.FAILURE:
      return {
        ...state,
        clusteringStatus: 'ERROR',
      };
    case FETCH_CLUSTERS.SUCCESS: {
      const { result } = payload;
      return {
        ...state,
        clusteringStatus: 'COMPLETE',
        clusters: result,
      };
    }
    case LOCATION_CHANGE:
      return initialState;
    default:
      return state;
  }
}
