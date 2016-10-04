import { ADD_FASTAS, UPLOAD_FASTA } from '../actions';

function finishedUploading(state, { name }) {
  const { uploading } = state;
  uploading.delete(name);

  return {
    ...state,
    uploading: new Set(uploading),
  };
}

export default {
  initialState: {
    queue: [],
    uploading: new Set(),
  },
  actions: {
    [ADD_FASTAS](state, { fastas }) {
      return {
        ...state,
        queue: [
          ...fastas.map(_ => _.name),
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
    [UPLOAD_FASTA.SUCCESS]: finishedUploading,
    [UPLOAD_FASTA.FAILURE]: finishedUploading,
  },
};
