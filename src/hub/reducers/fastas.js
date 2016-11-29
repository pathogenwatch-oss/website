import {
  ADD_FASTAS, UPLOAD_FASTA, UPDATE_FASTA_PROGRESS,
  REMOVE_FASTA, UNDO_REMOVE_FASTA,
} from '../actions';

import { taxIdMap, isSupported } from '^/species';
import { getCountryInfo } from '../../utils/country';

function updateFastas(state, name, update) {
  const fasta = state[name];
  return {
    ...state,
    [name]: { ...fasta, ...update },
  };
}

export default {
  initialState: {},
  actions: {
    [ADD_FASTAS](state, { fastas }) {
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
    },
    [UPLOAD_FASTA.ATTEMPT](state, { name }) {
      return updateFastas(state, name, { uploadAttempted: true, error: null });
    },
    [UPLOAD_FASTA.FAILURE](state, { name, error }) {
      return updateFastas(state, name, { error });
    },
    [UPLOAD_FASTA.SUCCESS](state, { name, result }) {
      const { speciesId, speciesName, country } = result;
      const supported = isSupported(result);
      const species = taxIdMap.get(speciesId);

      const speciesKey = supported ? species.name : speciesName;
      const speciesLabel = supported ? species.formattedShortName : speciesName;

      return updateFastas(state, name, {
        speciesKey,
        speciesLabel,
        ...result,
        country: getCountryInfo(country),
      });
    },
    [UPDATE_FASTA_PROGRESS](state, { name, progress }) {
      return updateFastas(state, name, { progress });
    },
    [REMOVE_FASTA](state, { name }) {
      delete state[name];
      return { ...state };
    },
    [UNDO_REMOVE_FASTA](state, { fasta }) {
      return {
        ...state,
        [fasta.name]: fasta,
      };
    },
  },
};
