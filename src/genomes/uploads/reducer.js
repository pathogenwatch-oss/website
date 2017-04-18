import * as actions from './actions';

import { statuses } from './constants';

function handleUploadCompletion(state, id) {
  const { queue, uploading, batch } = state;
  uploading.delete(id);

  return {
    ...state,
    uploading: new Set(uploading),
    batch: queue.length + uploading.size === 0 ? new Set() : batch,
  };
}

function updateGenomes(state, id, update) {
  const genome = state[id];
  return {
    ...state,
    [id]: { ...genome, ...update },
  };
}

const initialState = {
  batch: new Set(),
  queue: [],
  uploading: new Set(),
  uploadedAt: null,
  entities: {},
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case actions.ADD_GENOMES: {
      const ids = payload.genomes.map(_ => _.id);
      const uploadedAt = state.uploadedAt || new Date().toISOString();
      return {
        ...state,
        uploadedAt,
        batch: new Set([ ...state.batch, ...ids ]),
        queue: [ ...state.queue, ...ids ],
        entities: payload.genomes.reduce((memo, genome) => {
          delete genome.error;
          memo[genome.id] = {
            ...genome,
            uploadedAt,
            status: statuses.PENDING,
            progress: 0,
          };
          return memo;
        }, { ...state.entities }),
      };
    }
    case actions.UPLOAD_GENOME.ATTEMPT: {
      const { id } = payload;
      const { entities } = state;
      return {
        ...state,
        queue: state.queue.slice(1),
        uploading: new Set([ ...state.uploading, payload.id ]),
        entities: updateGenomes(entities, id, { status: statuses.UPLOADING }),
      };
    }
    case actions.UPLOAD_GENOME.FAILURE: {
      const { id, error } = payload;
      const { entities } = state;
      return {
        ...state,
        ...handleUploadCompletion(state, payload.id),
        entities: updateGenomes(entities, id, { error, status: statuses.ERROR }),
      };
    }
    case actions.UPLOAD_GENOME.SUCCESS: {
      const { id, result } = payload;
      const { entities } = state;

      const original = entities[id];
      delete entities[id];

      return {
        ...state,
        ...handleUploadCompletion(state, payload.id),
        entities: updateGenomes(
          entities,
          result.id,
          { ...original, ...result, status: statuses.SUCCESS }
        ),
      };
    }
    case actions.UPDATE_GENOME_PROGRESS: {
      const { id, progress } = payload;
      const { entities } = state;
      return {
        ...state,
        entities: updateGenomes(entities, id, { progress }),
      };
    }
    case actions.REMOVE_GENOMES: {
      const { ids } = payload;
      const { entities } = state;

      for (const id of ids) {
        delete entities[id];
      }

      return {
        ...state,
        entities: { ...entities },
      };
    }
    default:
      return state;
  }
}
