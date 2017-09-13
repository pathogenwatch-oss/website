import * as actions from './actions';

import { statuses } from '../constants';

function updateFile(state, id, update) {
  const file = state[id];
  const next = { ...file, ...update };
  return {
    ...state,
    [id]: next,
  };
}

function initialiseFiles(state, files) {
  return files.reduce((memo, file) => {
    delete file.error;
    memo[file.id] = {
      ...file,
      status: statuses.PENDING,
      progress: 0,
    };
    return memo;
  }, state);
}

const initialState = {
  files: {},
  queue: [],
  processing: new Set(),

  genomes: {},
  analyses: {},
  selectedOrganism: null,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case actions.ADD_GENOMES: {
      const ids = payload.genomes.map(_ => _.id);
      return {
        ...initialState,
        queue: ids,
        uploadedAt: payload.uploadedAt,
        files: initialiseFiles({}, payload.genomes),
      };
    }
    case actions.UPLOAD_REQUEUE_FILES: {
      const ids = payload.genomes.map(_ => _.id);
      return {
        ...state,
        queue: ids,
        files: initialiseFiles({ ...state.files }, payload.genomes),
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
      const { files } = state;
      return {
        ...state,
        files: updateFile(files, id, { status: statuses.COMPRESSING }),
      };
    }
    case actions.UPLOAD_GENOME.ATTEMPT: {
      const { id } = payload;
      const { files } = state;
      return {
        ...state,
        files: updateFile(files, id, { status: statuses.UPLOADING }),
      };
    }
    case actions.GENOME_UPLOAD_PROGRESS: {
      const { id, progress } = payload;
      const { files } = state;
      return {
        ...state,
        files: updateFile(files, id, { progress }),
      };
    }
    case actions.UPLOAD_GENOME.FAILURE:
    case actions.UPDATE_GENOME.FAILURE: {
      const { id, error } = payload;
      const { files } = state;
      return {
        ...state,
        files: updateFile(files, id, { error, status: statuses.ERROR }),
      };
    }
    case actions.UPLOAD_GENOME.SUCCESS: {
      const { id, result } = payload;
      const { files } = state;

      return {
        ...state,
        files: updateFile(files, id, { status: statuses.SUCCESS }),
        genomes: { ...state.genomes, [result.id]: result },
      };
    }
    case actions.UPDATE_GENOME.SUCCESS: {
      const { id, result } = payload;
      const { files } = state;
      const status = statuses.SUCCESS;

      return {
        ...state,
        files: updateFile(files, id, { ...result, status }),
      };
    }
    case actions.PROCESS_GENOME.SUCCESS:
    case actions.PROCESS_GENOME.FAILURE: {
      const { files } = state;
      const { id, error } = payload;

      const processing = new Set(state.processing);
      processing.delete(payload.id);

      return {
        ...state,
        processing,
        files:
          error ?
            updateFile(files, id, { error, status: statuses.ERROR }) :
            state.files,
      };
    }
    case actions.REMOVE_GENOMES: {
      const { ids } = payload;
      const { files } = state;

      for (const id of ids) {
        delete files[id];
      }

      return {
        ...state,
        files: { ...files },
      };
    }
    case actions.UPLOAD_ANALYSIS_RECEIVED: {
      const { analyses } = state;
      const { id } = payload;
      const analysis = analyses[id] || {};
      return {
        ...state,
        analyses: {
          ...analyses,
          [id]: { ...analysis, [payload.task]: payload.result },
        },
      };
    }
    case actions.UPLOAD_FETCH_GENOMES.SUCCESS: {
      const nextGenomes = {};
      const nextAnalyses = {};
      for (const genome of payload.result) {
        nextGenomes[genome.id] = {
          ...genome,
          status: statuses.SUCCESS,
          genomeId: genome.id,
          analysis: undefined,
          pending: undefined,
        };
        const pendingAnalysis = {};
        for (const task of genome.pending) {
          pendingAnalysis[task] = null;
        }
        nextAnalyses[genome.id] = {
          ...pendingAnalysis,
          ...genome.analysis,
          ...(state.analyses[genome.id] || {}),
        };
      }

      return {
        ...state,
        selectedOrganism: null,
        genomes: nextGenomes,
        analyses: nextAnalyses,
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
