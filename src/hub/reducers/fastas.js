import {
  ADD_FASTAS, UPLOAD_FASTA, UPDATE_FASTA_PROGRESS,
  REMOVE_FASTA, UNDO_REMOVE_FASTA,
} from '../actions';

import { taxIdMap, isSupported } from '../../species';

function updateFastas(state, name, update) {
  const fasta = state[name];
  return {
    ...state,
    [name]: { ...fasta, ...update },
  };
}

export default function (state = {}, { type, payload }) {
  switch (type) {
    case ADD_FASTAS: {
      const { fastas } = payload;
      if (!fastas.length) return state;

      return fastas.reduce((memo, fasta) => {
        if (fasta.name in memo) {
          return {
            ...memo,
            [fasta.name]: { ...fasta, error: null, uploadAttempted: false },
          };
        }
        return { ...memo, [fasta.name]: fasta };
      }, state);
    }
    case UPLOAD_FASTA.ATTEMPT: {
      const { name } = payload;
      return updateFastas(state, name, { uploadAttempted: true, error: null });
    }
    case UPLOAD_FASTA.FAILURE: {
      const { name, error } = payload;
      return updateFastas(state, name, { error });
    }
    case UPLOAD_FASTA.SUCCESS: {
      const { name, result } = payload;
      const { speciesId, speciesName } = result;
      const supported = isSupported(result);
      const species = taxIdMap.get(speciesId);

      const speciesKey = supported ? species.name : speciesName;
      const speciesLabel = supported ? species.formattedShortName : speciesName;

      return updateFastas(state, name, {
        speciesKey,
        speciesLabel,
        ...result,
      });
    }
    case UPDATE_FASTA_PROGRESS: {
      const { name, progress } = payload;
      return updateFastas(state, name, { progress });
    }
    case REMOVE_FASTA: {
      const { name } = payload;
      delete state[name];
      return { ...state };
    }
    case UNDO_REMOVE_FASTA: {
      const { fasta } = payload;
      return {
        ...state,
        [fasta.name]: fasta,
      };
    }
    default:
      return state;
  }
}
