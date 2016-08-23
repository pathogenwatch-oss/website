import { ADD_FASTAS, UPLOAD_FASTA, UPDATE_FASTA_PROGRESS } from './actions';

export const fastas = {
  initialState: {},
  actions: {
    [ADD_FASTAS](state, { files }) {
      if (!files.length) return state;

      return files.reduce((memo, file) => {
        if (file.name in memo) return memo;

        memo[file.name] = file;
        return memo;
      }, state);
    },
    [UPLOAD_FASTA](state, { name, ready, error, result }) {
      const fasta = state[name];

      const newState = {
        ...state,
        [name]: {
          ...fasta,
          name,
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
    // [UPLOAD_FASTA](state, { name, ready }) {
    //   if (!name || ready) return state;
    //
    //   return [
    //     name,
    //     ...state,
    //   ];
    // },
    [ADD_FASTAS](state, { files }) {
      return [
        ...files.map(_ => _.name),
        ...state,
      ];
    },
  },
};

export const uploads = {
  initialState: {
    queue: [],
    uploading: new Set(),
  },
  actions: {
    [ADD_FASTAS](state, { files }) {
      return {
        ...state,
        queue: [
          ...files.map(_ => _.name),
          ...state.queue,
        ],
      };
    },
    [UPLOAD_FASTA](state, { name, ready }) {
      if (ready) return state;
      return {
        queue: state.queue.slice(1),
        uploading: new Set([ ...state.uploading, name ]),
      };
    },
    [UPDATE_FASTA_PROGRESS](state, { progress, name }) {
      if (progress !== 100) return state;

      const { uploading } = state;
      uploading.delete(name);

      return {
        ...state,
        uploading: new Set(uploading),
      };
    },
  },
};
