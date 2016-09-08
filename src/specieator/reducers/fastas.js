import { ADD_FASTAS, UPLOAD_FASTA, UPDATE_FASTA_PROGRESS } from '../actions';

import { taxIdMap } from '^/species';

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
        if (fasta.name in memo) return memo;
        return { ...memo, [fasta.name]: fasta };
      }, state);
    },
    [UPLOAD_FASTA.ATTEMPT](state, { name }) {
      return updateFastas(state, name, { ready: false });
    },
    [UPLOAD_FASTA.FAILURE](state, { name, error }) {
      return updateFastas(state, name, { ready: true, error });
    },
    [UPLOAD_FASTA.SUCCESS](state, { name, result }) {
      const { speciesId, speciesName } = result;
      const supported = speciesId !== null;
      const species = taxIdMap.get(speciesId);

      const speciesKey = supported ? species.name : speciesName;
      const speciesLabel = supported ? species.formattedShortName : speciesName;

      return updateFastas(state, name, {
        supported,
        speciesKey,
        speciesLabel,
        ...result,
      });
    },
    [UPDATE_FASTA_PROGRESS](state, { name, progress }) {
      return updateFastas(state, name, { progress });
    },
  },
};
