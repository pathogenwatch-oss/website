export function getProgressPercentage(collection) {
  const { totalResultsReceived, totalResultsExpected } = collection.progress || {};

  return (
    totalResultsExpected ? Math.floor(totalResultsReceived / totalResultsExpected * 100) : 0
  );
}
