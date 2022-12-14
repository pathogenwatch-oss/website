import * as actions from './actions';
import { UPLOAD_FETCH_GENOMES } from '../actions';
import { UPLOAD_ADD_GENOMES } from '../../actions';

const initialState = {
  entities: {},
  lastMessageReceived: null,
  position: null,
  selectedOrganism: null,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case actions.UPLOAD_ANALYSIS_RECEIVED: {
      const { genomeId, results } = payload;
      const { entities } = state;
      const analyses = entities[genomeId] || {};
      const nextAnalyses = { ...analyses };
      for (const { task, version, result, error } of results) {
        nextAnalyses[task] = error ? false : version;
        if (result) {
          nextAnalyses[task] = result;
        }
      }
      return {
        ...state,
        entities: {
          ...entities,
          [genomeId]: nextAnalyses,
        },
        lastMessageReceived: new Date(),
        position: 0,
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

    case UPLOAD_FETCH_GENOMES.SUCCESS: {
      const nextEntities = {};
      const { genomes, position } = payload.result;

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
        nextEntities[genome.id] = {
          ...analysis,
          ...pendingAnalysis,
        };
      }
      return {
        ...state,
        position,
        entities: nextEntities,
      };
    }

    case UPLOAD_ADD_GENOMES.SUCCESS: {
      const entities = {};
      for (const genome of payload.genomes) {
        entities[genome.id] = {};
      }
      return {
        ...state,
        entities,
      };
    }

    default:
      return state;
  }
}
