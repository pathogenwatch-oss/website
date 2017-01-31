import {
  FETCH_GENOMES,
  ADD_GENOMES, UPLOAD_GENOME, UPDATE_GENOME_PROGRESS,
  REMOVE_GENOME, UNDO_REMOVE_GENOME,
} from '../actions';

import { taxIdMap, isSupported } from '../../species';

function updateGenomes(state, name, update) {
  const genome = state[name];
  return {
    ...state,
    [name]: { ...genome, ...update },
  };
}

export default function (state = {}, { type, payload }) {
  switch (type) {
    case FETCH_GENOMES.SUCCESS: {
      return payload.result.reduce((memo, genome) => {
        const { speciesId, speciesName } = genome;
        const supported = isSupported(genome);
        const species = taxIdMap.get(speciesId);
        const speciesKey = supported ? species.name : speciesName;
        const speciesLabel = supported ? species.formattedShortName : speciesName;
        memo[genome.name] = {
          speciesKey,
          speciesLabel,
          ...genome,
          error: null,
          uploadAttempted: null,
        };
        return memo;
      }, state);
    }
    case ADD_GENOMES: {
      const { genomes } = payload;
      if (!genomes.length) return state;

      return genomes.reduce((memo, genome) => {
        if (genome.name in memo) {
          return {
            ...memo,
            [genome.name]: { ...genome, error: null, uploadAttempted: false },
          };
        }
        return { ...memo, [genome.name]: genome };
      }, state);
    }
    case UPLOAD_GENOME.ATTEMPT: {
      const { name } = payload;
      return updateGenomes(state, name, { uploadAttempted: true, error: null });
    }
    case UPLOAD_GENOME.FAILURE: {
      const { name, error } = payload;
      return updateGenomes(state, name, { error });
    }
    case UPLOAD_GENOME.SUCCESS: {
      const { name, result } = payload;
      const { speciesId, speciesName } = result;
      const supported = isSupported(result);
      const species = taxIdMap.get(speciesId);

      const speciesKey = supported ? species.name : speciesName;
      const speciesLabel = supported ? species.formattedShortName : speciesName;

      return updateGenomes(state, name, {
        speciesKey,
        speciesLabel,
        ...result,
      });
    }
    case UPDATE_GENOME_PROGRESS: {
      const { name, progress } = payload;
      return updateGenomes(state, name, { progress });
    }
    case REMOVE_GENOME: {
      const { name } = payload;
      delete state[name];
      return { ...state };
    }
    case UNDO_REMOVE_GENOME: {
      const { genome } = payload;
      return {
        ...state,
        [genome.name]: genome,
      };
    }
    default:
      return state;
  }
}
