import * as actions from '../actions';
import { FETCH_TREE } from '../../collection-viewer/tree/actions';

function flagGenomes(genomes, flag) {
  return genomes.reduce((memo, genome) => {
    memo[genome.uuid] = {
      ...genome,
      [`__${flag}`]: true,
    };
    return memo;
  }, {});
}

export default function (state = {}, { type, payload }) {
  switch (type) {
    case actions.FETCH_COLLECTION.SUCCESS: {
      const { collection } = payload.result;
      const { genomes = [], organism = {} } = collection;
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
