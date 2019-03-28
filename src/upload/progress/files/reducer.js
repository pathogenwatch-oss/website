import * as actions from './actions';
import { ADD_GENOMES } from '../../actions';

import { statuses } from './constants';

const initialState = {
  entities: {},
  queue: [],
  processing: new Set(),
};

function updateFile(state, { id, filename }, update) {
  const genome = state.entities[id];
  return {
    ...state,
    entities: {
      ...state.entities,
      [id]: {
        ...genome,
        [filename]: {
          ...genome[filename],
          ...update,
        },
      },
    },
  };
}

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case ADD_GENOMES.SUCCESS: {
      const entities = {};
      for (const genome of payload.result) {
        for (const file of genome.files) {
          genome.files[file.name] = {
            error: null,
            handle: file,
            name: file.name,
            progress: 0,
            status: statuses.PENDING,
          };
        }
        entities[genome.id] = genome.files;
      }
      return {
        ...initialState,
        entities,
      };
    }

    case actions.PROCESS_GENOME.ATTEMPT:
      return {
        ...updateFile(state, payload, { status: statuses.QUEUED }),
        queue: state.queue.slice(1),
        processing: new Set([ ...state.processing, payload.id ]),
      };

    case actions.COMPRESS_GENOME.ATTEMPT:
      return updateFile(state, payload, { status: statuses.COMPRESSING });

    case actions.UPLOAD_GENOME.ATTEMPT:
      return updateFile(state, payload, { status: statuses.UPLOADING });

    case actions.GENOME_UPLOAD_PROGRESS:
      return updateFile(state, payload, { progress: payload.progress });

    case actions.UPLOAD_GENOME.FAILURE:
      return updateFile(state, payload, {
        error: payload.error,
        status: statuses.ERROR,
      });

    case actions.UPLOAD_GENOME.SUCCESS: {
      return updateFile(state, payload, {
        status: statuses.SUCCESS,
      });
    }

    case actions.PROCESS_GENOME.SUCCESS:
    case actions.PROCESS_GENOME.FAILURE: {
      const processing = new Set(state.processing);
      processing.delete(payload.id);
      const { error } = payload;
      return {
        ...updateFile(
          state,
          payload,
          error
            ? { status: statuses.ERROR, error }
            : { status: statuses.SUCCESS }
        ),
        processing,
      };
    }

    case 'UPLOAD_READS_PROGRESS':
      return updateFile(state, payload, {
        stage: payload.stage,
        progress: payload.progress,
      });

    default:
      return state;
  }
}
