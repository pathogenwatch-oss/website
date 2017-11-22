import * as actions from '../actions';
import { FETCH_TREE } from '../../collection-viewer/tree/actions';

function flagGenomes(genomes, flag) {
  return genomes.reduce((memo, genome) => {
    const analysis = { ...genome.analysis };
    if (Array.isArray(genome.analysis.paarsnp)) {
      const { antibiotics = [] } = genome.analysis.paarsnp;
      analysis.paarsnp = {
        ...genome.analysis.paarsnp,
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
      [`__${flag}`]: true,
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
      return {
        ...state,
        ...flagGenomes(genomes, 'isPublic'),
      };
    }
    default:
      return state;
  }
}
