import * as actions from './actions';

import { statuses, types, views } from '../constants';

function updateGenome(state, id, update) {
  const file = state[id];
  const next = { ...file, ...update };
  return {
    ...state,
    [id]: next,
  };
}

function initialiseGenomes(state, genomes) {
  for (const genome of genomes) {
    state[genome.id] = {
      ...genome,
      analysis: {},
      error: null,
      progress: 0,
      status: statuses.PENDING,
    };
  }
  return state;
}

const initialState = {
  queue: [],
  processing: new Set(),

  genomes: {},
  uploadedAt: null,
  selectedOrganism: null,
  view: null,
  assembly: {},
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case actions.ADD_GENOMES.SUCCESS: {
      const ids = Object.values(payload.result);
      for (const genome of payload.genomes) {
        genome.id = payload.result[genome.id];
      }
      const [ first ] = payload.genomes;
      return {
        ...initialState,
        queue: ids,
        uploadedAt: payload.uploadedAt,
        genomes: initialiseGenomes({}, payload.genomes),
        view: first.type === types.READS ? views.ASSEMBLY : views.ANALYSIS,
      };
    }
    case actions.UPLOAD_REQUEUE_FILES: {
      const ids = payload.files.map(_ => _.id);
      return {
        ...state,
        queue: ids,
        genomes: initialiseGenomes({ ...state.genomes }, payload.files),
      };
    }
    case actions.PROCESS_GENOME.ATTEMPT: {
      const { id } = payload;
      const { genomes } = state;
      return {
        ...state,
        queue: state.queue.slice(1),
        processing: new Set([ ...state.processing, id ]),
        genomes: updateGenome(genomes, id, { status: statuses.QUEUED }),
      };
    }
    case actions.COMPRESS_GENOME.ATTEMPT: {
      const { id } = payload;
      const { genomes } = state;
      return {
        ...state,
        genomes: updateGenome(genomes, id, { status: statuses.COMPRESSING }),
      };
    }
    case actions.UPLOAD_GENOME.ATTEMPT: {
      const { id } = payload;
      const { genomes } = state;
      return {
        ...state,
        genomes: updateGenome(genomes, id, { status: statuses.UPLOADING }),
      };
    }
    case actions.GENOME_UPLOAD_PROGRESS: {
      const { id, progress } = payload;
      const { genomes } = state;
      return {
        ...state,
        genomes: updateGenome(genomes, id, { progress }),
      };
    }
    case actions.UPLOAD_GENOME.FAILURE:
    case actions.UPDATE_GENOME.FAILURE: {
      const { id, error } = payload;
      const { genomes } = state;
      return {
        ...state,
        genomes: updateGenome(genomes, id, { error, status: statuses.ERROR }),
      };
    }
    case actions.UPLOAD_GENOME.SUCCESS: {
      const { id, result } = payload;
      const { genomes } = state;
      return {
        ...state,
        genomes: updateGenome(genomes, id, {
          ...result,
          status: statuses.SUCCESS,
        }),
      };
    }
    case actions.UPDATE_GENOME.SUCCESS: {
      const { id, result } = payload;
      const { genomes } = state;

      return {
        ...state,
        genomes: updateGenome(genomes, id, result),
      };
    }
    case actions.PROCESS_GENOME.SUCCESS:
    case actions.PROCESS_GENOME.FAILURE: {
      const { genomes } = state;
      const { id, error } = payload;

      const processing = new Set(state.processing);
      processing.delete(payload.id);

      return {
        ...state,
        processing,
        genomes: error
          ? updateGenome(genomes, id, { status: statuses.ERROR, error })
          : updateGenome(genomes, id, { status: statuses.SUCCESS }),
      };
    }
    // case actions.REMOVE_GENOMES: {
    //   const { ids } = payload;
    //   const { genomes } = state;

    //   for (const id of ids) {
    //     delete files[id];
    //   }

    //   return {
    //     ...state,
    //     genomes: { ...files },
    //   };
    // }
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
      let hasReads = false;
      let incomplete = false;
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
        if (genome.type === types.READS) {
          hasReads = true;
        }
        if (genome.files) {
          incomplete = true;
        }
        nextGenomes[genome.id] = {
          ...state.genomes[genome.id],
          ...genome,
          status: statuses.SUCCESS,
          speciated:
            (genome.analysis && !!genome.analysis.speciator) ||
            genome.errored.indexOf('speciator') !== -1,
          analysis: {
            ...genome.analysis,
            ...pendingAnalysis,
          },
        };
      }
      let view;
      if (state.view !== null) {
        view = state.view;
      } else if (incomplete) {
        view = views.RECOVERY;
      } else if (hasReads) {
        view = views.ASSEMBLY;
      } else {
        view = views.ANALYSIS;
      }
      return {
        ...state,
        position,
        view,
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
      const genome = state.genomes[payload.id];
      const file = genome.files[payload.file];
      return {
        ...state,
        genomes: {
          ...state.genomes,
          [payload.id]: {
            ...genome,
            files: {
              ...genome.files,
              [payload.file]: {
                stage: payload.stage,
                progress: file.stage !== payload.stage ? 0 : payload.progress,
              },
            },
          },
        },
      };
    }
    case 'SET_PROGRESS_VIEW':
      return {
        ...state,
        view: payload.view,
      };
    case 'ASSEMBLY_PIPELINE_STATUS':
      return {
        ...state,
        assembly: payload,
      };
    case 'ASSEMBLY_PROGRESS_TICK':
      return {
        ...state,
        assemblyTick: Date.now(),
      };
    default:
      return state;
  }
}
