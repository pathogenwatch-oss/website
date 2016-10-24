import { ADD_FASTAS, UPLOAD_FASTA } from '../actions';

function handleUploadCompletion(state, name) {
  const { queue, uploading, batchSize } = state;
  uploading.delete(name);

  return {
    ...state,
    uploading: new Set(uploading),
    batchSize: queue.length + uploading.size === 0 ? 0 : batchSize,
  };
}

const initialState = {
  batchSize: 0,
  queue: [],
  uploading: new Set(),
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case ADD_FASTAS:
      return {
        ...state,
        batchSize: state.batchSize + payload.fastas.length,
        queue: [
          ...state.queue,
          ...payload.fastas.map(_ => _.name),
        ],
      };
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
