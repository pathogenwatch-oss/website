import * as actions from '../actions';
import { FETCH_TREE } from '../../collection-viewer/tree/actions';

function decorateReferenceGenomes(genomes) {
  return Object.keys(genomes)
    .reduce((memo, genomeId) => {
      memo[genomeId] = {
        ...genomes[genomeId],
        __isReference: true,
      };
      return memo;
    }, {}
  );
}

function decorateCollectionGenomes(genomes) {
  return genomes.reduce((memo, genome) => {
    memo[genome.uuid] = {
      ...genome,
      __isCollection: true,
    };
    return memo;
  }, {});
}

function decoratePublicGenomes(genomes) {
  return genomes.reduce((memo, genome) => {
    memo[genome.uuid] = {
      ...genome,
      __isPublic: true,
    };
    return memo;
  }, {});
}

export default function (state = {}, { type, payload }) {
  switch (type) {
    case actions.FETCH_COLLECTION.SUCCESS: {
      const { result } = payload;
      return {
        ...state,
        ...decorateCollectionGenomes(result.genomes),
      };
    }
    case actions.FETCH_SPECIES_DATA.SUCCESS: {
      const { result: [ reference ] } = payload;
      return {
        ...state,
        ...decorateReferenceGenomes(reference.genomes),
      };
    }
    case FETCH_TREE.SUCCESS: {
      const { result } = payload;
      return {
        ...state,
        ...decoratePublicGenomes(result.genomes),
      };
    }
    default:
      return state;
  }
}
