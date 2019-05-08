import { combineReducers } from 'redux';

import * as actions from './actions';
import { UPLOAD_FETCH_GENOMES } from '../actions';
import { UPLOAD_ADD_GENOMES } from '../../actions';

import { statuses, types } from './constants';

function updateFile(state, { id, filename }, update) {
  const files = state[id];
  return {
    ...state,
    [id]: {
      ...files,
      [filename]: {
        ...files[filename],
        ...update,
      },
    },
  };
}

function entities(state = {}, { type, payload }) {
  switch (type) {
    case UPLOAD_ADD_GENOMES.SUCCESS: {
      const nextState = {};
      for (const genome of payload.genomes) {
        const files = {};
        for (const file of genome.files) {
          files[file.name] = {
            error: null,
            handle: file,
            name: file.name,
            progress: 0,
          };
        }
        nextState[genome.id] = files;
      }
      return nextState;
    }

    case 'UPLOAD_READS_PROGRESS':
      return updateFile(state, payload, {
        stage: payload.stage,
        progress: payload.progress,
      });

      // case actions.GENOME_UPLOAD_PROGRESS:
      //   return updateFile(state, payload, { progress: payload.progress });

    default:
      return state;
  }
}

function genomes(state = {}, { type, payload }) {
  switch (type) {
    case UPLOAD_ADD_GENOMES.SUCCESS: {
      const nextState = {};
      for (const genome of payload.genomes) {
        nextState[genome.id] = {
          id: genome.id,
          name: genome.name,
          status: statuses.PENDING,
          type: genome.type,
        };
      }
      return nextState;
    }

    case UPLOAD_FETCH_GENOMES.SUCCESS: {
      const nextState = {};
      for (const genome of payload.result.genomes) {
        nextState[genome.id] = {
          id: genome.id,
          name: genome.name,
          status: genome.files ? statuses.PENDING : statuses.SUCCESS,
          type: genome.type,
          ...state[genome.id], // retains existing state
        };
      }
      return nextState;
    }

    case actions.PROCESS_GENOME.ATTEMPT:
      return {
        ...state,
        [payload.id]: {
          ...state[payload.id],
          status: statuses.QUEUED,
        },
      };

    case actions.COMPRESS_GENOME.ATTEMPT:
      return {
        ...state,
        [payload.id]: {
          ...state[payload.id],
          status: statuses.COMPRESSING,
        },
      };

    case actions.UPLOAD_GENOME.ATTEMPT:
      return {
        ...state,
        [payload.id]: {
          ...state[payload.id],
          status: statuses.UPLOADING,
        },
      };

    case actions.GENOME_UPLOAD_PROGRESS:
      return {
        ...state,
        [payload.id]: {
          ...state[payload.id],
          progress: payload.progress,
        },
      };

    case actions.UPLOAD_GENOME.FAILURE:
    case actions.PROCESS_GENOME.FAILURE:
      return {
        ...state,
        [payload.id]: {
          ...state[payload.id],
          error: payload.error,
          status: statuses.ERROR,
        },
      };

    case actions.UPLOAD_GENOME.SUCCESS:
    case actions.PROCESS_GENOME.SUCCESS:
      return {
        ...state,
        [payload.id]: {
          ...state[payload.id],
          status: statuses.SUCCESS,
        },
      };

    default:
      return state;
  }
}

const initialState = {
  queue: [],
  processing: new Set(),
  numberOfReads: 0,
};

function _(state = initialState, { type, payload }) {
  switch (type) {
    case UPLOAD_ADD_GENOMES.SUCCESS: {
      let numberOfReads = 0;
      const queue = [];
      for (const genome of payload.genomes) {
        if (genome.type === types.READS) numberOfReads++;
        queue.push(genome.id);
      }
      return {
        ...initialState,
        queue,
        numberOfReads,
      };
    }

    case UPLOAD_FETCH_GENOMES.SUCCESS: {
      let numberOfReads = 0;
      for (const genome of payload.result.genomes) {
        if (genome.type === types.READS) numberOfReads++;
      }
      return {
        ...state,
        numberOfReads,
      };
    }

    case actions.PROCESS_GENOME.ATTEMPT:
      return {
        ...state,
        queue: state.queue.slice(1),
        processing: new Set([ ...state.processing, payload.id ]),
      };

    case actions.PROCESS_GENOME.SUCCESS:
    case actions.PROCESS_GENOME.FAILURE: {
      const processing = new Set(state.processing);
      processing.delete(payload.id);
      return {
        ...state,
        processing,
      };
    }

    default:
      return state;
  }
}

export default combineReducers({
  _,
  entities,
  genomes,
});
