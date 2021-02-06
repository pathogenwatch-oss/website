import Chart from 'chart.js';

import drawShape from '../shape/draw';

import theme from '../theme';

Chart.defaults.timeline = Chart.defaults.scatter;

const noStyle = {};

Chart.controllers.timeline = Chart.controllers.scatter.extend({
  dataElementType: Chart.elements.Point.extend({
    draw() {
      const vm = this._view;

      if (vm.skip) {
        return;
      }

      const ctx = this._chart.ctx;
      const radius = vm.radius;
      const dataset = this._chart.config.data.datasets[this._datasetIndex];
      const id = dataset.data[this._index].id;
      const style = dataset.styles[id] || noStyle;
      const isHighlighted = dataset.highlightedIds.has(id);
      drawShape(
        ctx,
        vm.x,
        vm.y,
        radius,
        style.shape,
        style.colour,
        isHighlighted && theme.primaryColour
      );
    },
  }),
});
