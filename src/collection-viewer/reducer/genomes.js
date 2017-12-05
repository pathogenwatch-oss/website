import * as actions from '../actions';
import { FETCH_TREE } from '../../collection-viewer/tree/actions';

function flagGenomes(genomes, flag) {
  return genomes.reduce((memo, genome) => {
    const analysis = { ...genome.analysis };
    if (Array.isArray(analysis.paarsnp.antibiotics)) {
      const { antibiotics = [] } = analysis.paarsnp;
      analysis.paarsnp = {
        ...analysis.paarsnp,
        antibiotics: antibiotics.reduce((abs, antibiotic) => {
          abs[antibiotic.name] = antibiotic;
          return abs;
        }, {}),
      };
    }
    const uuid = genome.uuid || genome._id;
    memo[uuid] = {
      ...genome,
      uuid,
      analysis,
      position: genome.position || {
        latitude: genome.latitude,
        longitude: genome.longitude,
      },
      date: genome.date || {
        year: genome.year,
        month: genome.month,
        day: genome.day,
      },
      [`__${genome.reference ? 'isReference' : flag}`]: true,
    };
    return memo;
  }, {});
}

export default function (state = {}, { type, payload }) {
  switch (type) {
    case actions.FETCH_COLLECTION.SUCCESS: {
      const { genomes = [], organism = {} } = payload.result;
      const { references = [] } = organism;
      return {
        ...state,
        ...flagGenomes(genomes, 'isCollection'),
        ...flagGenomes(references, 'isReference'),
      };
    }
    case FETCH_TREE.SUCCESS: {
      const { genomes } = payload.result;
      if (!genomes) return state;
      return {
        ...state,
        ...flagGenomes(genomes, 'isPublic'),
      };
    }
    default:
      return state;
  }
}
