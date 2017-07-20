import * as actions from './actions';

import { statuses } from './constants';

function updateGenomes(state, id, update) {
  const genome = state[id];
  const next = { ...genome, ...update };
  return {
    ...state,
    [id]: next,
  };
}

const initialState = {
  batch: new Set(),
  queue: [],
  processing: new Set(),
  uploadedAt: null,
  entities: {},
  settings: {
    compression: false,
    individual: false,
  },
  serverIds: {},
  analyses: {},
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
    case actions.PROCESS_GENOME.ATTEMPT: {
      return {
        ...state,
        queue: state.queue.slice(1),
        processing: new Set([ ...state.processing, payload.id ]),
      };
    }
    case actions.COMPRESS_GENOME.ATTEMPT: {
      const { id } = payload;
      const { entities } = state;
      return {
        ...state,
        entities: updateGenomes(entities, id, { status: statuses.COMPRESSING }),
      };
    }
    case actions.UPLOAD_GENOME.ATTEMPT: {
      const { id } = payload;
      const { entities } = state;
      return {
        ...state,
        entities: updateGenomes(entities, id, { status: statuses.UPLOADING }),
      };
    }
    case actions.GENOME_UPLOAD_PROGRESS: {
      const { id, progress } = payload;
      const { entities } = state;
      return {
        ...state,
        entities: updateGenomes(entities, id, { progress }),
      };
    }
    case actions.UPLOAD_GENOME.FAILURE:
    case actions.UPDATE_GENOME.FAILURE: {
      const { id, error } = payload;
      const { entities } = state;
      return {
        ...state,
        entities: updateGenomes(entities, id, { error, status: statuses.ERROR }),
      };
    }
    case actions.UPLOAD_GENOME.SUCCESS: {
      const { id, result } = payload;
      const { entities } = state;

      return {
        ...state,
        entities: updateGenomes(
          entities,
          id,
          { status: statuses.SUCCESS, genomeId: result.id }
        ),
      };
    }
    case actions.UPDATE_GENOME.SUCCESS: {
      const { id, result } = payload;
      const { entities } = state;
      const status = statuses.SUCCESS;

      return {
        ...state,
        entities: updateGenomes(entities, id, { ...result, status }),
      };
    }
    case actions.PROCESS_GENOME.SUCCESS:
    case actions.PROCESS_GENOME.FAILURE: {
      const { queue, processing, batch, entities } = state;
      const { id, error } = payload;
      processing.delete(payload.id);

      return {
        ...state,
        processing: new Set(processing),
        batch: queue.length + processing.size === 0 ? new Set() : batch,
        entities:
          error ?
            updateGenomes(entities, id, { error, status: statuses.ERROR }) :
            state.entities,
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
    case actions.UPLOAD_SETTING_CHANGED: {
      return {
        ...state,
        settings: {
          ...state.settings,
          [payload.setting]: payload.value,
        },
      };
    }
    case actions.UPLOAD_ANALYSIS_RECEIVED: {
      const { analyses } = state;
      const { id, props = {} } = payload;
      const analysis = analyses[id] || {};
      const pending = props.pending ?
        props.pending.reduce((memo, task) => {
          memo[task] = null;
          return memo;
        }, {}) :
        {};
      return {
        ...state,
        analyses: {
          ...analyses,
          [id]: { ...analysis, ...pending, [payload.task]: payload.result }
        },
      };
    }
    default:
      return state;
  }
}
