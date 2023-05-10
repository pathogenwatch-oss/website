import { REQUEST_BUILD_CLUSTERS, FETCH_CLUSTERS, FETCH_CLUSTER_EDGES, RUN_CLUSTER_LAYOUT, SET_CLUSTER_THRESHOLD, SET_CLUSTER_GENOME, SET_CLUSTERING_PROGRESS, SKIP_LAYOUT } from './actions';
import { SHOW_GENOME_REPORT } from '../genome-report/actions';
import { FETCH_COLLECTION } from '../collection-viewer/actions';

import { cluster } from './util';

import { MAX_CLUSTER_SIZE, MAX_DEFAULT_THRESHOLD } from './constants';


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
  allSchemeSts: [],
  edgeMatrix: null,
  index: {
    lambda: null,
    pi: null,
  },
  indexOfSelectedInAll: null,
  nodeCoordinates: null,
  nodes: null,
  organismId: null,
  progress: null,
  scheme: null,
  selectedGenomeId: null,
  skipMessage: null,
  status: 'INITIAL_STATUS',
  taskId: null,
  threshold: null,
  triedBuilding: false,
  version: null,
};

function calculateDefaultThreshold(pi, lambda, indexOfSelected) {
  for (let t = 1; t <= MAX_DEFAULT_THRESHOLD; t++) {
    const clustering = cluster(t, pi, lambda);
    const clusterId = clustering[indexOfSelected];
    const clusterSize = clustering.filter(id => id === clusterId).length;
    if (clusterSize > MAX_CLUSTER_SIZE) return t - 1;
  }
  return MAX_DEFAULT_THRESHOLD;
}

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
      const { nodes, sts, genomeIdx, scheme, version, organismId } = result;
      const { pi, lambda } = result.clusterIndex;
      return {
        ...state,
        status: 'FETCHED_CLUSTERS',
        nodes,
        index: {
          pi,
          lambda,
        },
        allSchemeSts: sts,
        indexOfSelectedInAll: genomeIdx,
        scheme,
        version,
        organismId,
        threshold: state.threshold || calculateDefaultThreshold(pi, lambda, genomeIdx),
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

    case FETCH_COLLECTION.ATTEMPT:
    case SET_CLUSTER_THRESHOLD: {
      const threshold = typeof(payload) === 'number' ? payload : Number(payload.threshold);
      const genomeId = typeof(payload) === 'number' ? state.selectedGenomeId : payload.genomeId;
      return threshold === state.threshold ? state : {
        ...state,
        threshold,
        status: state.nodes ? 'FETCHED_CLUSTERS' : 'INITIAL_STATUS',
        edgeMatrix: null,
        nodeCoordinates: null,
        selectedGenomeId: genomeId,
      };
    }

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
