import { ADD_FASTAS, UPLOAD_FASTA, UPDATE_FASTA_PROGRESS } from '../actions';

export default {
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
