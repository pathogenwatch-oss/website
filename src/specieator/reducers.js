import {
  ADD_FASTAS,
  UPLOAD_FASTA,
  UPDATE_FASTA_PROGRESS,
  CREATE_COLLECTION,
} from './actions';

function updateFastas(state, name, update) {
  const fasta = state[name];
  return {
    ...state,
    [name]: { ...fasta, ...update },
  };
}

export const fastas = {
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

export const fastaOrder = {
  initialState: [],
  actions: {
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
    [UPLOAD_FASTA.ATTEMPT](state, { name }) {
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

export const loading = {
  initialState: false,
  actions: {
    [CREATE_COLLECTION.ATTEMPT]: () => true,
    [CREATE_COLLECTION.SUCCESS]: () => false,
    [CREATE_COLLECTION.FAILURE]: () => false,
  },
};
