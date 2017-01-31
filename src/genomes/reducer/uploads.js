import { ADD_GENOMES, UPLOAD_GENOME } from '../actions';

function handleUploadCompletion(state, name) {
  const { queue, uploading, batch } = state;
  uploading.delete(name);

  return {
    ...state,
    uploading: new Set(uploading),
    batch: queue.length + uploading.size === 0 ? new Set() : batch,
  };
}

function handleAddGenomes(state, genomes) {
  const names = genomes.map(_ => _.name);
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
    case ADD_GENOMES:
      return handleAddGenomes(state, payload.genomes);
    case UPLOAD_GENOME.ATTEMPT:
      return {
        ...state,
        queue: state.queue.slice(1),
        uploading: new Set([ ...state.uploading, payload.name ]),
      };
    case UPLOAD_GENOME.SUCCESS:
    case UPLOAD_GENOME.FAILURE:
      return handleUploadCompletion(state, payload.name);
    default:
      return state;
  }
}
