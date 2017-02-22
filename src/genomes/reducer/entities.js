import {
  FETCH_GENOMES,
  ADD_GENOMES, UPLOAD_GENOME, UPDATE_GENOME_PROGRESS,
  REMOVE_GENOME, UNDO_REMOVE_GENOME,
} from '../actions';

function updateGenomes(state, id, update) {
  const genome = state[id];
  return {
    ...state,
    [id]: { ...genome, ...update },
  };
}

export default function (state = {}, { type, payload }) {
  switch (type) {
    case FETCH_GENOMES.SUCCESS: {
      return payload.result.reduce((memo, genome) => {
        memo[genome.id] = {
          ...genome,
        };
        return memo;
      }, {});
    }
    case ADD_GENOMES: {
      const { genomes } = payload;
      if (!genomes.length) return state;

      return genomes.reduce((memo, genome) => {
        if (genome.id in memo) {
          return {
            ...memo,
            [genome.id]: { ...genome, uploadAttempted: false, error: null },
          };
        }
        return { ...memo, [genome.id]: genome };
      }, state);
    }
    case UPLOAD_GENOME.ATTEMPT: {
      const { id } = payload;
      return updateGenomes(state, id, { uploadAttempted: true, error: null });
    }
    case UPLOAD_GENOME.FAILURE: {
      const { id, error } = payload;
      return updateGenomes(state, id, { error });
    }
    case UPLOAD_GENOME.SUCCESS: {
      const { id, result } = payload;

      const temp = state[id];
      delete state[id]; // remove temporary record

      return {
        ...state,
        [result.id]: { // replace with id from server
          ...temp,
          ...result,
        },
      };
    }
    case UPDATE_GENOME_PROGRESS: {
      const { id, progress } = payload;
      return updateGenomes(state, id, { progress });
    }
    case REMOVE_GENOME: {
      const { id } = payload;
      return {
        ...state,
        [id]: {
          ...state[id],
          binned: true,
        },
      };
    }
    case UNDO_REMOVE_GENOME: {
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
