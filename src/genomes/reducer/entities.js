import {
  FETCH_GENOMES,
  ADD_GENOMES, UPLOAD_GENOME, UPDATE_GENOME_PROGRESS,
  REMOVE_GENOME, UNDO_REMOVE_GENOME,
} from '../actions';

import { taxIdMap, isSupported } from '../../species';

function updateGenomes(state, id, update) {
  const genome = state[id];
  return {
    ...state,
    [id]: { ...genome, ...update },
  };
}

function categoriseBySpecies(genome) {
  const { speciesId, speciesName } = genome;
  const supported = isSupported(genome);
  const species = taxIdMap.get(speciesId);
  return {
    speciesKey: supported ? species.name : speciesName,
    speciesLabel: supported ? species.formattedShortName : speciesName,
  };
}

export default function (state = {}, { type, payload }) {
  switch (type) {
    case FETCH_GENOMES.SUCCESS: {
      return payload.result.reduce((memo, genome) => {
        memo[genome.id] = {
          ...categoriseBySpecies(genome),
          ...genome,
        };
        return memo;
      }, { ...state });
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
          ...categoriseBySpecies(result),
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
          bin: true,
        },
      };
    }
    case UNDO_REMOVE_GENOME: {
      const { id } = payload;
      return {
        ...state,
        [id]: {
          ...state[id],
          bin: false,
        },
      };
    }
    default:
      return state;
  }
}
