import { getViewer, getCollection } from '../selectors';

export function getProgressPercentage(state) {
  const collection = getCollection(state);
  if (!collection.progress) return 0;
  return collection.progress.percent || 0;
}

export const getPosition = state => getViewer(state).entities.position;
