import {
  FETCH_COLLECTION,
  COLLECTION_FETCH_POSITION,
  UPDATE_COLLECTION_PROGRESS,
} from '../actions';

export default function (state = null, { type, payload }) {
  switch (type) {
    case FETCH_COLLECTION.SUCCESS:
    case COLLECTION_FETCH_POSITION.SUCCESS:
      return payload.result.position || state;
    case UPDATE_COLLECTION_PROGRESS: {
      const { results = {} } = payload.progress;
      const { core, fp, ...queuedTasks } = results;
      if (Object.keys(queuedTasks).some(task => results[task] > 0)) return 0;
      return state;
    }
    default:
      return state;
  }
}
