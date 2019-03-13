import * as actions from './actions';

import { views } from '../constants';

const initialState = {
  queue: [],
  processing: new Set(),

  analysis: {},
  uploadedAt: null,
  selectedOrganism: null,
  view: null,
  filenameToGenomeId: {},

  session: {},
  assemblyProgress: {},
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case actions.UPLOAD_ANALYSIS_RECEIVED: {
      const { analysis } = state;
      const { genomeId, results } = payload;
      const analyses = analysis[genomeId] || {};
      const nextAnalyses = { ...analyses };
      for (const { task, version, result, error } of results) {
        nextAnalyses[task] = error ? false : version;
        if (result) {
          nextAnalyses[task] = result;
        }
      }
      return {
        ...state,
        analysis: {
          ...analysis,
          [genomeId]: nextAnalyses,
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
      const nextAnalysis = {};
      const nextFilenameToGenomeId = {};
      const { genomes, position } = payload.result;
      let incomplete = false;
      for (const { analysis, ...genome } of genomes) {
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
        if (genome.files) {
          incomplete = true;
          for (const filename of genome.files) {
            nextFilenameToGenomeId[filename] = genome.id;
          }
        }
        nextAnalysis[genome.id] = {
          ...analysis,
          ...pendingAnalysis,
        };
      }
      return {
        ...state,
        position,
        view: incomplete ? views.RECOVERY : views.PROGRESS,
        selectedOrganism: null,
        analysis: nextAnalysis,
        filenameToGenomeId: nextFilenameToGenomeId,
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
    case 'ASSEMBLY_PIPELINE_STATUS':
      return {
        ...state,
        assemblyProgress: payload,
      };
    case 'ASSEMBLY_PROGRESS_TICK':
      return {
        ...state,
        assemblyTick: Date.now(),
      };
    case 'UPLOAD_RECOVER_SESSION': {
      return {
        ...initialState,
        view: views.PROGRESS,
      };
    }
    default:
      return state;
  }
}
