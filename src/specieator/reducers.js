import { UPLOAD_FASTA, UPDATE_FASTA_PROGRESS } from './actions';

export const fastas = {
  initialState: {},
  actions: {
    [UPLOAD_FASTA](state, { name, ready, error, result }) {
      const fasta = state[name] || {
        name,
        progress: 0,
      };

      const newState = {
        ...state,
        [name]: {
          ...fasta,
          ready,
          error,
          speciesId: result && result.speciesId,
        },
      };

      return newState;
    },
    [UPDATE_FASTA_PROGRESS](state, { name, progress }) {
      const fasta = state[name];
      if (!fasta) return state;

      return {
        ...state,
        [name]: {
          ...fasta,
          progress,
        },
      };
    },
  },
};

export const fastaOrder = {
  initialState: [],
  actions: {
    [UPLOAD_FASTA](state, { name, ready }) {
      if (!name || ready) return state;

      return [
        name,
        ...state,
      ];
    },
  },
};
