import { REQUEST_BUILD_CLUSTERS, FETCH_CLUSTERS, FETCH_CLUSTER_EDGES, RUN_CLUSTER_LAYOUT, SET_CLUSTER_THRESHOLD, SET_CLUSTER_GENOME, SET_CLUSTERING_PROGRESS, SKIP_NETWORK } from './actions';
import { SHOW_GENOME_REPORT } from '../genomes/report/actions';

// States:
//  INITIAL_STATUS
//  BUILDING_CLUSTERS
//  BUILT_CLUSTERS
//  FETCHING_CLUSTERS
//  FETCHED_CLUSTERS
//  FETCHING_EDGES
//  FETCHED_EDGES
//  RUNNING_LAYOUT
//  COMPLETED_LAYOUT
//  SKIP_NETWORK

//  FAILED_BUILDING_CLUSTERS
//  FAILED_FETCHING_CLUSTERS
//  FAILED_FETCHING_EDGES

const initialState = {
  status: 'INITIAL_STATUS',
  progress: null,
  index: {
    pi: null,
    lambda: null,
  },
  names: null,
  sts: null,
  genomeId: null,
  genomeIdx: null,
  scheme: null,
  threshold: 30,
  edges: null,
  triedBuilding: false,
  skipMessage: null,
  nodePositions: null,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {

    case REQUEST_BUILD_CLUSTERS.ATTEMPT:
      return {
        ...state,
        status: 'BUILDING_CLUSTERS',
        progress: 0.0,
        triedBuilding: true,
      };
    case REQUEST_BUILD_CLUSTERS.FAILURE:
      return {
        ...state,
        status: 'FAILED_BUILDING_CLUSTERS',
      };
    case REQUEST_BUILD_CLUSTERS.SUCCESS:
      return state;
    case SET_CLUSTERING_PROGRESS: {
      if (state.status === 'BUILDING_CLUSTERS') {
        if (payload.status === 'READY') {
          return {
            ...state,
            progress: 100,
            status: 'BUILT_CLUSTERS',
          };
        } else if (payload.status === 'IN PROGRESS') {
          return {
            ...state,
            progress: state.progress < payload.progress ? payload.progress : state.progress,
          };
        }
        return {
          ...state,
          status: 'FAILED_BUILDING_CLUSTERS',
        };
      }
      return state;
    }

    case FETCH_CLUSTERS.ATTEMPT:
      return {
        ...state,
        status: 'FETCHING_CLUSTERS',
      };
    case FETCH_CLUSTERS.FAILURE:
      return {
        ...state,
        status: 'FAILED_FETCHING_CLUSTERS',
      };
    case FETCH_CLUSTERS.SUCCESS: {
      const { result = {} } = payload;
      const { names, sts, genomeIdx, scheme } = result;
      const { pi, lambda } = result.clusterIndex;
      return {
        ...state,
        status: 'FETCHED_CLUSTERS',
        index: {
          pi,
          lambda,
        },
        names,
        sts,
        genomeIdx,
        scheme,
      };
    }

    case FETCH_CLUSTER_EDGES.ATTEMPT:
      return {
        ...state,
        status: 'FETCHING_EDGES',
      };
    case FETCH_CLUSTER_EDGES.FAILURE:
      return {
        ...state,
        status: 'FAILED_FETCHING_EDGES',
      };
    case FETCH_CLUSTER_EDGES.SUCCESS:
      return {
        ...state,
        edges: payload.result.edges,
        status: 'FETCHED_EDGES',
      };

    case RUN_CLUSTER_LAYOUT.ATTEMPT:
      return {
        ...state,
        status: 'RUNNING_LAYOUT',
      };
    case RUN_CLUSTER_LAYOUT.SUCCESS:
      return {
        ...state,
        status: 'COMPLETED_LAYOUT',
        nodePositions: payload.result,
      };

    case SET_CLUSTER_THRESHOLD:
      return payload === state.threshold ? state : {
        ...state,
        threshold: payload,
        status: (state.names || []).length > 0 ? 'FETCHED_CLUSTERS' : 'INITIAL_STATUS',
        edges: null,
        nodePositions: null,
      };

    case SKIP_NETWORK:
      return {
        ...state,
        status: 'SKIP_NETWORK',
        skipMessage: payload,
      };

    case SHOW_GENOME_REPORT.ATTEMPT:
      return payload.genomeId === state.genomeId ? state : { ...initialState, genomeId: payload.genomeId };

    case SET_CLUSTER_GENOME:
      return payload === state.genomeId ? state : { ...initialState, genomeId: payload };

    default:
      return state;
  }
}
