export function stackPoints(chart, datasetMeta, datasetData, radius) {
  if (!datasetMeta.data || datasetMeta.data.length === 0) {
    return;
  }
  const firstDataPoint = datasetData.data[datasetMeta.data[0]._index];
  const minValue = datasetMeta.data[0]._xScale.min;
  const maxValue = datasetMeta.data[0]._xScale.max;
  const range = (maxValue - minValue);
  const width = chart.chartArea.right - chart.chartArea.left;
  const height = chart.chartArea.bottom - chart.chartArea.top;
  const stack = [ Math.round(firstDataPoint.value * width) - radius ];
  for (const point of datasetMeta.data) {
    const dataPoint = datasetData.data[point._index];

    const value = dataPoint.x.valueOf();
    if (value < point._xScale.min || value > point._xScale.max) continue;

    const pixelX = (value / range) * width;
    const startX = pixelX - radius;
    const endX = pixelX + radius;

    let y = null;

    for (let i = 0; i < stack.length; i++) {
      if (startX >= stack[i]) {
        y = i;
        break;
      }
    }

    if (y === null) {
      y = stack.length;
    }

    dataPoint.y = y;
    stack[y] = endX;
  }
  const dataRange = stack.length;
  const canvasRange = Math.floor(height / ((radius * 2) + 2));
  if (canvasRange > dataRange) {
    // centre points vertically in the middle of the canvas by adjusting the scale start and end limits
    const padding = (canvasRange - dataRange) / 2;
    chart.scales['y-axis-1'].start = -1 - padding;
    chart.scales['y-axis-1'].end = dataRange + padding;
  } else {
    chart.scales['y-axis-1'].start = -1;
    chart.scales['y-axis-1'].end = dataRange;
    // chart.scales['y-axis-1'].start = 0;
    // chart.scales['y-axis-1'].end = canvasRange;
  }
}
