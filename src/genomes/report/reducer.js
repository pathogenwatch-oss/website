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
        ...initialState,
        name: payload.name,
        status: 'LOADING',
      };
    case SHOW_GENOME_REPORT.SUCCESS: {
      const { clustering = {}, ...genome } = payload.result;
      return {
        ...state,
        genome,
        status: 'READY',
        clusters: clustering,
        clusteringStatus: clustering && Object.keys(clustering).length ? 'COMPLETE' : null,
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
        clusters: state.clusters,
        clusteringStatus: state.clusteringStatus, // hack to stop the clustering status flickering
      };
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
          clusteringStatus: 'IN PROGRESS',
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
    default:
      return state;
  }
}
