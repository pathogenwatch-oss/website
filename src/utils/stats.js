function calculateMedian(numbers) {
  if (numbers.length % 2 === 0) {
    return (numbers[numbers.length / 2] + numbers[(numbers.length / 2) + 1]) / 2;
  }
  return numbers[Math.floor(numbers.length / 2)];
}

function calculateQuartiles(numbers) {
  const midPoint = Math.floor(numbers.length / 2);
  const offset = (numbers.length % 2);
  return [
    calculateMedian(numbers.slice(0, midPoint - offset)),
    calculateMedian(numbers),
    calculateMedian(numbers.slice(midPoint + offset)),
  ];
}

function calculateStats(numbers) {
  let min = Number.MAX_VALUE;
  let max = Number.MIN_VALUE;
  let sum = 0;
  for (const n of numbers) {
    if (n < min) {
      min = n;
    }
    if (n > max) {
      max = n;
    }
    sum += n;
  }
  const mean = sum / numbers.length;
  let stdErr = 0;
  for (const n of numbers) {
    stdErr += (n - mean) ** 2;
  }
  const stdDev = Math.sqrt(stdErr / (numbers.length - 1));
  const [ lowerQuartile, median, upperQuartile ] = calculateQuartiles(numbers);
  return {
    min,
    max,
    sum,
    stdDev,
    stdErr,
    mean,
    lowerQuartile,
    median,
    upperQuartile,
  };
}

module.exports = {
  calculateStats,
};
