export function getProgressPercentage(collection) {
  const { receivedResults, expectedResults } = collection.progress || {};

  return (
    expectedResults ? Math.floor(receivedResults / expectedResults * 100) : 0
  );
}
