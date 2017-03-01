import dateSince from 'date-since';

import { FETCH_GENOMES, MOVE_TO_BIN, UNDO_MOVE_TO_BIN } from '../actions';

export default function (state = {}, { type, payload }) {
  switch (type) {
    case FETCH_GENOMES.SUCCESS: {
      return payload.result.reduce((memo, genome) => {
        memo[genome.id] = {
          ...genome,
          createdAt: dateSince(new Date(genome.createdAt)),
        };
        return memo;
      }, {});
    }
    case MOVE_TO_BIN: {
      const { id } = payload;
      return {
        ...state,
        [id]: {
          ...state[id],
          binned: true,
        },
      };
    }
    case UNDO_MOVE_TO_BIN: {
      const { id } = payload;
      return {
        ...state,
        [id]: {
          ...state[id],
          binned: false,
        },
      };
    }
    default:
      return state;
  }
}
