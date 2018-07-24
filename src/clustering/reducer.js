import { REQUEST_BUILD_CLUSTERS, FETCH_CLUSTERS, FETCH_CLUSTER_EDGES, RUN_CLUSTER_LAYOUT, SET_CLUSTER_THRESHOLD, SET_CLUSTER_GENOME, SET_CLUSTERING_PROGRESS, SKIP_LAYOUT } from './actions';
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
  allSchemeSts: null,
  selectedGenomeId: null,
  indexOfSelectedInAll: null,
  scheme: null,
  threshold: 30,
  edgeMatrix: null,
  triedBuilding: false,
  skipMessage: null,
  nodeCoordinates: null,
  taskId: null,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {

    case REQUEST_BUILD_CLUSTERS.ATTEMPT:
      return {
        ...state,
        status: 'BUILDING_CLUSTERS',
        progress: 0.0,
        triedBuilding: true,
        taskId: null,
      };
    case REQUEST_BUILD_CLUSTERS.FAILURE: {
      if (
        payload.genomeId !== state.selectedGenomeId ||
        state.status !== 'BUILDING_CLUSTERS'
      ) return state;
      return {
        ...state,
        status: 'FAILED_BUILDING_CLUSTERS',
      };
    }
    case REQUEST_BUILD_CLUSTERS.SUCCESS: {
      if (
        payload.genomeId !== state.selectedGenomeId ||
        state.status !== 'BUILDING_CLUSTERS'
      ) return state;
      return {
        ...state,
        taskId: payload.result.taskId,
      };
    }

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
    case FETCH_CLUSTERS.FAILURE: {
      if (
        payload.genomeId !== state.selectedGenomeId ||
        state.status !== 'FETCHING_CLUSTERS'
      ) return state;
      return {
        ...state,
        status: 'FAILED_FETCHING_CLUSTERS',
      };
    }
    case FETCH_CLUSTERS.SUCCESS: {
      if (
        payload.genomeId !== state.selectedGenomeId ||
        state.status !== 'FETCHING_CLUSTERS'
      ) return state;
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
        allSchemeSts: sts,
        indexOfSelectedInAll: genomeIdx,
        scheme,
      };
    }

    case FETCH_CLUSTER_EDGES.ATTEMPT:
      return {
        ...state,
        status: 'FETCHING_EDGES',
      };
    case FETCH_CLUSTER_EDGES.FAILURE: {
      if (
        state.status !== 'FETCHING_EDGES' ||
        state.selectedGenomeId !== payload.genomeId ||
        state.threshold !== payload.threshold
      ) return state;
      return {
        ...state,
        status: 'FAILED_FETCHING_EDGES',
      };
    }
    case FETCH_CLUSTER_EDGES.SUCCESS: {
      if (
        state.status !== 'FETCHING_EDGES' ||
        state.selectedGenomeId !== payload.genomeId ||
        state.threshold !== payload.threshold
      ) return state;
      return {
        ...state,
        edgeMatrix: payload.result.edges,
        status: 'FETCHED_EDGES',
      };
    }

    case RUN_CLUSTER_LAYOUT.ATTEMPT:
      return {
        ...state,
        nodeCoordinates: null,
        status: 'RUNNING_LAYOUT',
      };
    case RUN_CLUSTER_LAYOUT.SUCCESS: {
      if (payload.result.skip) return state;
      return {
        ...state,
        status: 'COMPLETED_LAYOUT',
        nodeCoordinates: payload.result.coordinates,
      };
    }

    case SET_CLUSTER_THRESHOLD:
      return payload === state.threshold ? state : {
        ...state,
        threshold: payload,
        status: (state.names || []).length > 0 ? 'FETCHED_CLUSTERS' : 'INITIAL_STATUS',
        edgeMatrix: null,
        nodeCoordinates: null,
      };

    case SKIP_LAYOUT:
      return {
        ...state,
        status: 'COMPLETED_LAYOUT',
        nodeCoordinates: payload,
      };

    case SHOW_GENOME_REPORT.ATTEMPT:
      return { ...initialState, selectedGenomeId: payload.genomeId };

    case SET_CLUSTER_GENOME:
      return payload === state.selectedGenomeId ? state : { ...initialState, selectedGenomeId: payload };

    default:
      return state;
  }
}
