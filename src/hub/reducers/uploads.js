import { ADD_FASTAS, UPLOAD_FASTA } from '../actions';

function handleUploadCompletion(state, name) {
  const { queue, uploading, batch } = state;
  uploading.delete(name);

  return {
    ...state,
    uploading: new Set(uploading),
    batch: queue.length + uploading.size === 0 ? new Set() : batch,
  };
}

function handleAddFastas(state, fastas) {
  const names = fastas.map(_ => _.name);
  return {
    ...state,
    batch: new Set([ ...state.batch, ...names ]),
    queue: [ ...state.queue, ...names ],
  };
}

const initialState = {
  batch: new Set(),
  queue: [],
  uploading: new Set(),
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case ADD_FASTAS:
      return handleAddFastas(state, payload.fastas);
    case UPLOAD_FASTA.ATTEMPT:
      return {
        ...state,
        queue: state.queue.slice(1),
        uploading: new Set([ ...state.uploading, payload.name ]),
      };
    case UPLOAD_FASTA.SUCCESS:
    case UPLOAD_FASTA.FAILURE:
      return handleUploadCompletion(state, payload.name);
    default:
      return state;
  }
}
