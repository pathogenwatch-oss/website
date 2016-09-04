import { ADD_FASTAS, UPLOAD_FASTA, UPDATE_FASTA_PROGRESS } from '../actions';

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
    [ADD_FASTAS](state, { files }) {
      if (!files.length) return state;

      return files.reduce((memo, file) => {
        if (file.name in memo) return memo;
        return { ...memo, [file.name]: { name: file.name, file } };
      }, state);
    },
    [UPLOAD_FASTA.ATTEMPT](state, { name }) {
      return updateFastas(state, name, { ready: false });
    },
    [UPLOAD_FASTA.FAILURE](state, { name, error }) {
      return updateFastas(state, name, { ready: true, error });
    },
    [UPLOAD_FASTA.SUCCESS](state, { name, result }) {
      return updateFastas(state, name, { ready: true, ...result });
    },
    [UPDATE_FASTA_PROGRESS](state, { name, progress }) {
      return updateFastas(state, name, { progress });
    },
  },
};

export const getFastas = ({ entities }) => entities.fastas;
export const getFastasAsList = ({ entities }) =>
  Object.keys(entities.fastas).map(key => entities.fastas[key]);
