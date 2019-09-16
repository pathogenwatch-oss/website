import { TREE_LOADED } from '../tree/actions';
import { FETCH_COLLECTION } from '../actions';

export default function (state = [], { type, payload }) {
  switch (type) {
    case FETCH_COLLECTION.SUCCESS: {
      const { genomes = [] } = payload.result;
      return genomes.map(_ => _.uuid);
    }
    case TREE_LOADED:
      return payload.leafIds;
    default:
      return state;
  }
}
