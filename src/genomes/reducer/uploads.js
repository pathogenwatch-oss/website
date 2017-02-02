import { ADD_GENOMES, UPLOAD_GENOME } from '../actions';

function handleUploadCompletion(state, id) {
  const { queue, uploading, batch } = state;
  uploading.delete(id);

  return {
    ...state,
    uploading: new Set(uploading),
    batch: queue.length + uploading.size === 0 ? new Set() : batch,
  };
}

function handleAddGenomes(state, genomes) {
  const ids = genomes.map(_ => _.id);
  return {
    ...state,
    batch: new Set([ ...state.batch, ...ids ]),
    queue: [ ...state.queue, ...ids ],
  };
}

const initialState = {
  batch: new Set(),
  queue: [],
  uploading: new Set(),
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case ADD_GENOMES:
      return handleAddGenomes(state, payload.genomes);
    case UPLOAD_GENOME.ATTEMPT:
      return {
        ...state,
        queue: state.queue.slice(1),
        uploading: new Set([ ...state.uploading, payload.id ]),
      };
    case UPLOAD_GENOME.SUCCESS:
    case UPLOAD_GENOME.FAILURE:
      return handleUploadCompletion(state, payload.id);
    default:
      return state;
  }
}
