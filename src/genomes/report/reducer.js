import { SHOW_GENOME_REPORT, CLOSE_GENOME_REPORT, REQUEST_CLUSTERING, UPDATE_CLUSTERING_PROGRESS, FETCH_CLUSTERS, UPDATE_CLUSTERING_THRESHOLD, UPDATE_CLUSTERING_EDGES } from './actions';
import { FETCH_GENOME_LIST } from '../actions';
import { LOCATION_CHANGE } from '../../location';

const initialState = {
  name: null,
  genome: null,
  status: null,
  clusteringStatus: null,
  clusteringProgress: null,
  clusters: null,
  clusteringThreshold: 30,
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
        clusteringEdges: null,
      };
    case REQUEST_CLUSTERING.SUCCESS: {
      const { statusCode } = payload.result;
      if (statusCode === 304) {
        return {
          ...state,
          clusteringStatus: 'IN PROGRESS',
          clusteringEdges: null,
        };
      }
      return {
        ...state,
        clusteringStatus: 'PENDING',
        clusteringEdges: null,
      };
    }
    case REQUEST_CLUSTERING.FAILURE:
      return {
        ...state,
        clusteringStatus: 'ERROR',
        clusteringEdges: null,
      };
    case UPDATE_CLUSTERING_PROGRESS: {
      const { status, progress = state.clusteringProgress } = payload;
      return {
        ...state,
        clusteringStatus: status,
        clusteringProgress: progress,
        clusteringEdges: null,
      };
    }
    case FETCH_CLUSTERS.FAILURE:
      return {
        ...state,
        clusteringStatus: 'ERROR',
        clusteringEdges: null,
      };
    case FETCH_CLUSTERS.SUCCESS: {
      const { result } = payload;
      return {
        ...state,
        clusteringStatus: 'COMPLETE',
        clusters: result,
        clusteringEdges: null,
      };
    }
    case UPDATE_CLUSTERING_THRESHOLD:
      return {
        ...state,
        clusteringThreshold: payload,
        clusteringEdges: null,
      };
    case UPDATE_CLUSTERING_EDGES.SUCCESS:
      return {
        ...state,
        clusteringEdges: payload.result.edges,
      };
    default:
      return state;
  }
}
