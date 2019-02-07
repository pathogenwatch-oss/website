import * as actions from './actions';

import { statuses, types, views } from '../constants';

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

  uploadedAt: null,
  genomes: {},
  selectedOrganism: null,
  view: views.ANALYSIS,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case actions.ADD_GENOMES: {
      const ids = payload.genomes.map(_ => _.id);
      const [ first ] = payload.genomes;
      return {
        ...initialState,
        queue: ids,
        uploadedAt: payload.uploadedAt,
        files: initialiseFiles({}, payload.genomes),
        view: first.type === types.READS ? views.ASSEMBLY : views.ANALYSIS,
      };
    }
    case actions.UPLOAD_REQUEUE_FILES: {
      const ids = payload.files.map(_ => _.id);
      return {
        ...state,
        queue: ids,
        files: initialiseFiles({ ...state.files }, payload.files),
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
      const genome = state.genomes[result.id] || { analysis: {} };
      return {
        ...state,
        files: updateFile(files, id, { status: statuses.SUCCESS }),
        genomes: {
          ...state.genomes,
          [result.id]: {
            ...genome,
            ...result,
          },
        },
      };
    }
    case actions.UPDATE_GENOME.SUCCESS: {
      const { id, result } = payload;
      const { files } = state;

      return {
        ...state,
        files: updateFile(files, id, result),
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
        files: error
          ? updateFile(files, id, { status: statuses.ERROR, error })
          : updateFile(files, id, { status: statuses.SUCCESS }),
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
      const { genomes } = state;
      const { genomeId, results } = payload;
      const genome = genomes[genomeId] || {};
      const nextGenome = {
        ...genome,
        analysis: {
          ...(genome.analysis || {}),
        },
      };
      for (const { task, version, result, error } of results) {
        nextGenome.analysis[task] = error ? false : version;
        if (result) {
          Object.assign(nextGenome, result);
        }
      }
      return {
        ...state,
        genomes: {
          ...genomes,
          [genomeId]: nextGenome,
        },
        lastMessageReceived: new Date(),
        position: 0,
      };
    }
    case actions.UPLOAD_FETCH_GENOMES.ATTEMPT: {
      if (state.uploadedAt === payload.uploadedAt) return state;
      return {
        ...initialState,
        uploadedAt: payload.uploadedAt,
      };
    }
    case actions.UPLOAD_FETCH_GENOMES.SUCCESS: {
      const nextGenomes = {};
      const { files, position } = payload.result;
      for (const genome of files) {
        const pendingAnalysis = {};
        if (genome.pending) {
          for (const task of genome.pending) {
            pendingAnalysis[task] = null;
          }
        }
        if (genome.errored) {
          for (const task of genome.errored) {
            pendingAnalysis[task] = false;
          }
        }

        nextGenomes[genome.id] = {
          ...genome,
          status: statuses.SUCCESS,
          speciated:
            (genome.analysis && !!genome.analysis.speciator) ||
            genome.errored.indexOf('speciator') !== -1,
          genomeId: genome.id,
          analysis: {
            ...genome.analysis,
            ...pendingAnalysis,
          },
        };
      }

      return {
        ...state,
        position,
        selectedOrganism: null,
        genomes: nextGenomes,
      };
    }
    case actions.UPLOAD_ORGANISM_SELECTED:
      return {
        ...state,
        selectedOrganism: payload.organismId,
      };
    case actions.UPLOAD_FETCH_POSITION.SUCCESS:
      return {
        ...state,
        position: payload.result.position,
      };
    case 'UPLOAD_READS_PROGRESS': {
      const upload = state.files[payload.id];
      const file = upload.files[payload.file];
      return {
        ...state,
        files: {
          ...state.files,
          [payload.id]: {
            ...upload,
            status: statuses.UPLOADING,
            files: {
              ...upload.files,
              [payload.file]: {
                stage: payload.stage,
                progress: file.stage !== payload.stage ? 0 : payload.progress,
              },
            },
          },
        },
      };
    }
    case 'SET_PROGRESS_VIEW': {
      return {
        ...state,
        view: payload.view,
      };
    }
    default:
      return state;
  }
}
