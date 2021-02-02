const defaultFont = '14px "Roboto", "Helvetica", "Arial", sans-serif';
const defaultStyle = 'rgba(0,0,0,.54)';
const defaultLineWidth = 2;

export default function (Chart) {
  Chart.pluginService.register({
    beforeDatasetsDraw(chartInstance) {
      const yScale = chartInstance.scales['y-axis-0'];
      const xScale = chartInstance.scales['x-axis-0'];
      const canvas = chartInstance.chart;
      const ctx = canvas.ctx;

      if (chartInstance.options.horizontalLine) {
        for (let index = 0; index < chartInstance.options.horizontalLine.length; index++) {
          ctx.save();
          const line = chartInstance.options.horizontalLine[index];
          const yValue = line.y ? yScale.getPixelForValue(line.y) : 0;

          if (yValue) {
            ctx.beginPath();
            ctx.moveTo(xScale.getPixelForValue(xScale.min), yValue);
            ctx.lineTo(xScale.getPixelForValue(xScale.max), yValue);
            ctx.lineWidth = line.lineWidth || defaultLineWidth;
            ctx.strokeStyle = line.style || defaultStyle;
            if (line.dash) {
              ctx.setLineDash([ 8, 8 ]);
            }
            ctx.stroke();
          }

          if (line.text) {
            ctx.fillStyle = line.textStyle || line.style || defaultStyle;
            ctx.textBaseline = 'top'
            ctx.textAlign = 'right'
            ctx.font = line.font || defaultFont;
            ctx.fillText(line.text, xScale.getPixelForValue(xScale.max), yValue + 4);
          }
          ctx.restore();
        }
      }
    },
  });

  Chart.pluginService.register({
    beforeDatasetsDraw(chartInstance) {
      const xScale = chartInstance.scales['x-axis-0'];
      const yScale = chartInstance.scales['y-axis-0'];
      const canvas = chartInstance.chart;
      const ctx = canvas.ctx;

      if (chartInstance.options.verticalLine) {
        for (let index = 0; index < chartInstance.options.verticalLine.length; index++) {
          ctx.save();
          const line = chartInstance.options.verticalLine[index];
          const xValue = line.x ? xScale.getPixelForValue(line.x) : 0;

          if (xValue) {
            ctx.beginPath();
            ctx.moveTo(xValue, yScale.getPixelForValue(yScale.min));
            ctx.lineTo(xValue, yScale.getPixelForValue(yScale.max));
            ctx.lineWidth = line.lineWidth || defaultLineWidth;
            ctx.strokeStyle = line.style || defaultStyle;
            if (line.dash) {
              ctx.setLineDash([ 8, 8 ]);
            }
            ctx.stroke();
          }

          if (line.text) {
            ctx.fillStyle = line.textStyle || line.style || defaultStyle;
            ctx.font = line.font || defaultFont;
            ctx.textBaseline = 'top'
            ctx.fillText(line.text, xValue + 8, yScale.getPixelForValue(yScale.max));
          }
          ctx.restore();
        }
      }
    },
  });
}
