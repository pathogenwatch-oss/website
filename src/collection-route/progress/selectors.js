export function getProgressPercentage(collection) {
  if (!collection.progress) return 0;
  return collection.progress.percent || 0;
}
