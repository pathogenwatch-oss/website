import * as actions from './actions';

import { statuses } from '../constants';

function updateGenome(state, id, update) {
  const genome = state[id];
  const next = { ...genome, ...update };
  return {
    ...state,
    [id]: next,
  };
}

function initialiseEntities(state, genomes) {
  return genomes.reduce((memo, genome) => {
    delete genome.error;
    memo[genome.id] = {
      ...genome,
      status: statuses.PENDING,
      progress: 0,
    };
    return memo;
  }, state);
}

const initialState = {
  batch: new Set(),
  queue: [],
  processing: new Set(),
  entities: {},
  serverIds: {},
  analyses: {},
  selectedOrganism: null,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case actions.ADD_GENOMES: {
      const ids = payload.genomes.map(_ => _.id);
      return {
        ...initialState,
        batch: new Set(ids),
        queue: ids,
        uploadedAt: payload.uploadedAt,
        entities: initialiseEntities({}, payload.genomes),
      };
    }
    case actions.UPLOAD_REQUEUE_FILES: {
      const ids = payload.genomes.map(_ => _.id);
      return {
        ...state,
        queue: ids,
        entities: initialiseEntities({ ...state.entities }, payload.genomes),
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
        entities: updateGenome(entities, id, { status: statuses.COMPRESSING }),
      };
    }
    case actions.UPLOAD_GENOME.ATTEMPT: {
      const { id } = payload;
      const { entities } = state;
      return {
        ...state,
        entities: updateGenome(entities, id, { status: statuses.UPLOADING }),
      };
    }
    case actions.GENOME_UPLOAD_PROGRESS: {
      const { id, progress } = payload;
      const { entities } = state;
      return {
        ...state,
        entities: updateGenome(entities, id, { progress }),
      };
    }
    case actions.UPLOAD_GENOME.FAILURE:
    case actions.UPDATE_GENOME.FAILURE: {
      const { id, error } = payload;
      const { entities } = state;
      return {
        ...state,
        entities: updateGenome(entities, id, { error, status: statuses.ERROR }),
      };
    }
    case actions.UPLOAD_GENOME.SUCCESS: {
      const { id, result } = payload;
      const { entities } = state;

      return {
        ...state,
        entities: updateGenome(
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
        entities: updateGenome(entities, id, { ...result, status }),
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
            updateGenome(entities, id, { error, status: statuses.ERROR }) :
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
          [id]: { ...analysis, ...pending, [payload.task]: payload.result },
        },
      };
    }
    case actions.UPLOAD_FETCH_GENOMES.SUCCESS: {
      return {
        ...state,
        selectedOrganism: null,
        entities: payload.result.reduce((memo, genome) => {
          memo[genome.id] = {
            ...genome,
            status: statuses.SUCCESS,
            genomeId: genome.id,
          };
          return memo;
        }, {}),
      };
    }
    case actions.UPLOAD_ORGANISM_SELECTED:
      return {
        ...state,
        selectedOrganism: payload.organismId,
      };
    default:
      return state;
  }
}
