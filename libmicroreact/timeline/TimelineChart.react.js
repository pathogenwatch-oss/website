import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Chart from 'chart.js';

import 'hammerjs'; // fixes require inside plugin
import 'chartjs-plugin-zoom/chartjs-plugin-zoom.js';

import './chartjs-timeline-scatter';

const yPadding = 40;
const xPadding = 40;

const daysInUnit = {
  day: 1,
  week: 7,
  month: 30,
  quarter: 90,
  year: 365,
};

export default class extends React.Component {
  static displayName = 'TimelineChart';

  static propTypes = {
    addExportCallback: PropTypes.func,
    bounds: PropTypes.shape({
      min: PropTypes.instanceOf(moment).isRequired,
      max: PropTypes.instanceOf(moment).isRequired,
    }),
    chartData: PropTypes.arrayOf(
      PropTypes.shape({
        x: PropTypes.instanceOf(Date).isRequired,
        y: PropTypes.number.isRequired,
        id: PropTypes.string.isRequired,
      })
    ).isRequired,
    getTooltip: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
    highlightedIds: PropTypes.instanceOf(Set).isRequired,
    maxStackSize: PropTypes.number.isRequired,
    nodeSize: PropTypes.number.isRequired,
    onViewportChange: PropTypes.func.isRequired,
    removeExportCallback: PropTypes.func,
    setHighlightedIds: PropTypes.func.isRequired,
    styles: PropTypes.object.isRequired,
    unit: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    viewport: PropTypes.shape({
      minx: PropTypes.number.isRequired,
      maxx: PropTypes.number.isRequired,
      miny: PropTypes.number.isRequired,
      maxy: PropTypes.number.isRequired,
    }),
  };

  componentDidMount() {
    this.createChart();
    if (this.props.addExportCallback) {
      this.props.addExportCallback('timeline-png', () => this.domRef.toDataURL());
    }
  }

  componentDidUpdate(prev) {
    const sizeChanged =
      prev.width !== this.props.width || prev.height !== this.props.height;
    const dataChanged =
      prev.bounds !== this.props.bounds ||
      prev.chartData !== this.props.chartData ||
      prev.unit !== this.props.unit;
    const styleChanged =
      prev.highlightedIds !== this.props.highlightedIds ||
      prev.nodeSize !== this.props.nodeSize ||
      prev.styles !== this.props.styles;

    if (sizeChanged) {
      this.resizeChart();
    }

    if (dataChanged || styleChanged) {
      this.updateChart(dataChanged);
    }

    if (sizeChanged || dataChanged) {
      this.resetChartRanges();
    }

    if (this.props.viewport !== prev.viewport && this.props.viewport) {
      this.restoreViewport();
    }

    this.chart.update();
  }

  componentWillUnmount() {
    if (this.props.removeExportCallback) {
      this.props.removeExportCallback('timeline-png');
    }
    this.destroyChart();
  }

  getYTicks(minTick = 0) {
    const diameter = this.props.nodeSize * 2 + 2;
    const height = this.props.height - yPadding;
    const numberOfRows = height / diameter;
    return { min: minTick, max: numberOfRows + minTick };
  }

  getPanZoomRanges(bounds) {
    const ranges = { pan: {}, zoom: {} };
    const diameter = this.props.nodeSize * 2 + 2;

    ranges.pan.rangeMin = {
      x: bounds.min.toDate(),
      y: 0,
    };
    ranges.pan.rangeMax = {
      x: bounds.max.toDate(),
      y: this.props.maxStackSize + 1,
    };

    const width = this.props.width - xPadding;
    const daysInView = width / diameter;
    const height = this.props.height - yPadding;
    const numberOfRows = height / diameter;

    ranges.zoom.rangeMin = {
      x: daysInView * daysInUnit[this.props.unit] * 86400000, // converts days to milliseconds
      y: numberOfRows,
    };
    ranges.zoom.rangeMax = {
      x: this.props.bounds.max.diff(this.props.bounds.min),
      y: this.props.maxStackSize,
    };

    return ranges;
  }

  getChartBounds() {
    const totalDays = Math.max(
      1,
      this.props.bounds.max.diff(this.props.bounds.min, 'days')
    );
    const padding = Math.ceil(
      ((this.props.nodeSize + 2) * totalDays) / (this.props.width - xPadding)
    );

    return {
      min: moment(this.props.bounds.min).subtract(padding, 'day'),
      max: moment(this.props.bounds.max).add(padding, 'day'),
    };
  }

  createDatasets() {
    return {
      labels: [],
      datasets: [
        {
          label: 'Dataset',
          pointRadius: this.props.nodeSize / 2,
          pointHoverRadius: this.props.nodeSize / 2 + 1,
          data: this.props.chartData,
          highlightedIds: this.props.highlightedIds,
          styles: this.props.styles,
        },
      ],
    };
  }

  createChart() {
    const ctx = this.domRef.getContext('2d');

    this.domRef.height = this.props.height;
    this.domRef.width = this.props.width;

    const bounds = this.getChartBounds();
    const ranges = this.getPanZoomRanges(bounds);
    const { viewport } = this.props;

    this.chart = new Chart(ctx, {
      type: 'timeline',
      data: this.createDatasets(),
      options: {
        animation: false,
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: -24,
            bottom: 0,
          },
        },
        legend: {
          display: false,
        },
        maintainAspectRatio: false,
        onClick: (event, [ args ]) => {
          const append = event.metaKey || event.ctrlKey;
          if (args) {
            const item =
              args._chart.config.data.datasets[args._datasetIndex].data[
                args._index
              ];
            this.props.setHighlightedIds([ item.id ], append);
          } else {
            if (this.props.highlightedIds.size && !append) {
              this.props.setHighlightedIds();
            }
          }
        },
        pan: {
          enabled: true,
          mode: 'xy',
          rangeMin: ranges.pan.rangeMin,
          rangeMax: ranges.pan.rangeMax,
          onPan: () => this.saveViewport(),
        },
        responsive: false,
        responsiveAnimationDuration: 0,
        scales: {
          xAxes: [
            {
              position: 'bottom',
              time: {
                unit: this.props.unit,
                min: viewport ? viewport.minx : bounds.min,
                max: viewport ? viewport.maxx : bounds.max,
              },
              ticks: {
                maxRotation: 0,
                autoSkip: true,
                autoSkipPadding: 16,
              },
              type: 'time',
            },
          ],
          yAxes: [
            {
              display: false,
              ticks: viewport
                ? { min: viewport.miny, max: viewport.maxy }
                : this.getYTicks(),
            },
          ],
        },
        title: {
          display: true,
          text: '',
        },
        tooltips: {
          displayColors: false,
          callbacks: {
            title: (points, chart) => {
              const labels = points.map(item =>
                chart.datasets[item.datasetIndex].data[
                  item.index
                ].x.toLocaleDateString()
              );
              return labels.join(', ');
            },
            label: (item, chart) => {
              const point =
                chart.datasets[item.datasetIndex].data[item.index];
              return this.props.getTooltip(point);
            },
          },
        },
        zoom: {
          enabled: true,
          drag: false,
          mode: 'xy',
          rangeMin: ranges.zoom.rangeMin,
          rangeMax: ranges.zoom.rangeMax,
          onZoom: () => this.saveViewport(),
        },
      },
    });

    window.cgps_microreact_timelineChart = this.chart;
  }

  updateChart(refit) {
    if (refit) {
      const bounds = this.getChartBounds();
      this.chart.scales['x-axis-1'].options.time.min = bounds.min;
      this.chart.scales['x-axis-1'].options.time.max = bounds.max;
      this.chart.scales['x-axis-1'].options.time.unit = this.props.unit;

      const diameter = this.props.nodeSize * 2 + 2;
      const height = this.chart.chartArea.bottom - this.chart.chartArea.top;
      const numberOfRows = height / diameter;
      this.chart.scales['y-axis-1'].options.ticks.min = 0;
      this.chart.scales['y-axis-1'].options.ticks.max = numberOfRows;
    }

    this.chart.config.data = this.createDatasets();
    this.chart.clear();
  }

  resizeChart() {
    const minTick = this.chart.scales['y-axis-1'].options.ticks.min || 0;
    this.chart.resize();
    Object.assign(
      this.chart.scales['y-axis-1'].options.ticks,
      this.getYTicks(minTick)
    );
  }

  resetChartRanges() {
    const bounds = this.getChartBounds();
    const ranges = this.getPanZoomRanges(bounds);

    Object.assign(this.chart.config.options.pan, ranges.pan);
    Object.assign(this.chart.config.options.zoom, ranges.zoom);
  }

  destroyChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  saveViewport() {
    this.props.onViewportChange({
      minx: this.chart.scales['x-axis-1'].options.time.min.valueOf(),
      maxx: this.chart.scales['x-axis-1'].options.time.max.valueOf(),
      miny: this.chart.scales['y-axis-1'].options.ticks.min,
      maxy: this.chart.scales['y-axis-1'].options.ticks.max,
    });
  }

  restoreViewport() {
    this.chart.scales['x-axis-1'].options.time.min = this.props.viewport.minx;
    this.chart.scales['x-axis-1'].options.time.max = this.props.viewport.maxx;
    this.chart.scales['y-axis-1'].options.ticks.min = this.props.viewport.miny;
    this.chart.scales['y-axis-1'].options.ticks.max = this.props.viewport.maxy;
  }

  render() {
    const { width, height } = this.props;
    return (
      <div className="libmr-Timeline-plot" style={{ width, height }}>
        <canvas
          ref={c => {
            this.domRef = c;
          }}
        />
      </div>
    );
  }
}
