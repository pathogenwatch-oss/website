const defaultFont = '14px "Roboto", "Helvetica", "Arial", sans-serif';

export default function (Chart) {
  Chart.pluginService.register({
    beforeDatasetsDraw(chartInstance) {
      var yValue;
      var yScale = chartInstance.scales['y-axis-0'];
      var xScale = chartInstance.scales['x-axis-0'];
      var canvas = chartInstance.chart;
      var ctx = canvas.ctx;
      var index;
      var line;
      var style;

      if (chartInstance.options.horizontalLine) {
        for (index = 0; index < chartInstance.options.horizontalLine.length; index++) {
          ctx.save();
          line = chartInstance.options.horizontalLine[index];

          if (!line.style) {
            style = 'rgba(169,169,169, .6)';
          } else {
            style = line.style;
          }

          if (line.y) {
            yValue = yScale.getPixelForValue(line.y);
          } else {
            yValue = 0;
          }

          ctx.lineWidth = 2;

          if (yValue) {
            ctx.beginPath();
            ctx.moveTo(xScale.getPixelForValue(xScale.min), yValue);
            ctx.lineTo(xScale.getPixelForValue(xScale.max), yValue);
            ctx.strokeStyle = style;
            if (line.dash) {
              ctx.setLineDash([ 8, 8 ]);
            }
            ctx.stroke();
          }

          if (line.text) {
            ctx.fillStyle = style;
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
      var xValue;
      var xScale = chartInstance.scales['x-axis-0'];
      var yScale = chartInstance.scales['y-axis-0'];
      var canvas = chartInstance.chart;
      var ctx = canvas.ctx;
      var index;
      var line;
      var style;

      if (chartInstance.options.verticalLine) {
        for (index = 0; index < chartInstance.options.verticalLine.length; index++) {
          ctx.save();
          line = chartInstance.options.verticalLine[index];

          if (!line.style) {
            style = 'rgba(0,0,0,.54)';
          } else {
            style = line.style;
          }

          if (line.x) {
            xValue = xScale.getPixelForValue(line.x);
          } else {
            xValue = 0;
          }

          ctx.lineWidth = 2;

          if (xValue) {
            ctx.beginPath();
            ctx.moveTo(xValue, yScale.getPixelForValue(yScale.min));
            ctx.lineTo(xValue, yScale.getPixelForValue(yScale.max));
            ctx.strokeStyle = style;
            if (line.dash) {
              ctx.setLineDash([ 8, 8 ]);
            }
            ctx.stroke();
          }

          if (line.text) {
            ctx.fillStyle = 'rgba(0,0,0,.54)';
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
