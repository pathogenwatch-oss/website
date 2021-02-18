import React from 'react';
import Chart from 'chart.js';
import classnames from 'classnames';
import { Rnd } from 'react-rnd';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

import theme from '../theme';
import defaults from '../defaults';

const LABEL_SIZE = 64;

function calculateYAxesBounds(chartData) {
  let maxY = 0;
  let minY = Number.MAX_VALUE;
  for (const point of chartData) {
    if (point.y > maxY) maxY = point.y;
    if (point.y < minY) minY = point.y;
  }
  const offset = (maxY - minY) * 0.1;
  return {
    min: (minY > offset) ? (minY - offset) : 0,
    max: maxY + offset,
  };
}

export default class extends React.Component {
  static displayName = 'AreaChart'

  static propTypes = {
    bounds: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
    }).isRequired,
    chartData: PropTypes.arrayOf(
      PropTypes.shape({
        x: PropTypes.oneOfType([
          PropTypes.instanceOf(Date),
          PropTypes.number,
        ]).isRequired,
        y: PropTypes.number.isRequired,
        label: PropTypes.string.isRequired,
      })
    ).isRequired,
    formatLabel: PropTypes.func,
    height: PropTypes.number.isRequired,
    onBoundsChange: PropTypes.func.isRequired,
    showLabels: PropTypes.bool,
    width: PropTypes.number.isRequired,
  }

  static defaultProps = {
    formatLabel: x => x,
  }

  state = {
    isDragging: false,
    bounds: null,
  }

  componentDidMount() {
    this.createChart();

    this.debouncedChangeBounds = debounce(
      (bounds) => {
        if (this.state.isDragging) {
          this.props.onBoundsChange(bounds);
        }
      },
      defaults.DELAY
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.width !== this.props.width || prevProps.height !== this.props.height) {
      this.resizeChart();
    }

    if (prevProps.chartData !== this.props.chartData) {
      this.updateChart();
    }
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  createDatasets() {
    return {
      labels: this.props.chartData.map(x => x.label),
      datasets: [
        {
          data: this.props.chartData,
          get backgroundColor() {
            return theme.primaryColourAlphaMedium;
          },
          lineTension: 0,
          label: 'Histogram',
        },
      ],
    };
  }

  createChart() {
    this.domRef.height = this.props.height;
    this.domRef.width = this.props.width;
    const ctx = this.domRef.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: this.createDatasets(),
      options: {
        animation: false,
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: -40,
            bottom: 0,
          },
        },
        legend: {
          display: false,
        },
        maintainAspectRatio: false,
        responsive: false,
        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              display: false,
              ticks: calculateYAxesBounds(this.props.chartData),
            },
          ],
        },
        title: {
          display: true,
          text: '',
        },
        tooltips: {
          callbacks: {
            title: (points) => {
              const labels = points.map(
                (item) => this.props.chartData[item.index].label
              );
              return `${labels.join(' ')}: ${points.length} point${points.length === 1 ? '' : 's'}`;
            },
            label: () => '',
          },
          displayColors: false,
          yAlign: 'bottom',
        },
      },
    });

    if (process.env.NODE_ENV === 'development') {
      window.cgps_areachart = this;
    }
  }

  updateChart() {
    this.chart.config.data = this.createDatasets();
    const yAxesBounds = calculateYAxesBounds(this.props.chartData);
    this.chart.config.options.scales.yAxes[0].ticks.min = yAxesBounds.min;
    this.chart.config.options.scales.yAxes[0].ticks.max = yAxesBounds.max;
    this.chart.clear();
    this.chart.update();
  }

  resizeChart() {
    this.chart.resize();
  }

  destroyChart() {
    this.chart.destroy();
    this.chart = null;
  }

  sliderPositionToBounds(start, width) {
    const numberOfTicks = this.props.chartData.length - 1;
    return {
      min: start * numberOfTicks / this.props.width,
      max: (start + width) * numberOfTicks / this.props.width,
    };
  }

  render() {
    const sliderBounds = this.state.bounds || this.props.bounds;
    const step = this.props.width / Math.max(1, this.props.chartData.length - 1);
    const sliderStart = sliderBounds.min * step;
    const sliderWidth = Math.max(1, sliderBounds.max - sliderBounds.min) * step;
    const stackedLabels = (sliderWidth) < (LABEL_SIZE * 2);
    const stackedLeft = (sliderStart) > (this.props.width - LABEL_SIZE + 7);
    const stackedRight = (sliderStart + sliderWidth) < (LABEL_SIZE + 7);
    return (
      <div className="libmr-AreaChart" style={{ width: this.props.width, height: this.props.height }}>
        <canvas ref={c => { this.domRef = c; }} />
        <Rnd
          bounds="parent"
          minWidth={24}
          position={{
            x: sliderStart,
            y: 0,
          }}
          size={{
            width: sliderWidth,
            height: this.props.height,
          }}
          onDragStart={() =>
            this.setState({ isDragging: true })
          }
          onDrag={(e, delta) => {
            const bounds = this.sliderPositionToBounds(delta.x > 0 ? delta.x : 0, sliderWidth);
            this.setState({ bounds });
            this.debouncedChangeBounds(bounds);
          }}
          onDragStop={(e, delta) => {
            this.setState({ isDragging: false, bounds: null });
            const bounds = this.sliderPositionToBounds(delta.x > 0 ? delta.x : 0, sliderWidth);
            this.props.onBoundsChange(bounds);
          }}
          onResizeStart={() =>
            this.setState({ isDragging: true })
          }
          onResize={(e, direction, ref, delta, position) => {
            const bounds = this.sliderPositionToBounds(position.x > 0 ? position.x : 0, ref.offsetWidth);
            this.setState({ bounds });
            this.debouncedChangeBounds(bounds);
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            this.setState({ isDragging: false, bounds: null });
            const bounds = this.sliderPositionToBounds(position.x > 0 ? position.x : 0, ref.offsetWidth);
            this.props.onBoundsChange(bounds);
          }}
          className={
            classnames(
              'libmr-AreaChart-slider',
              {
                'has-labels': (this.props.showLabels || this.state.isDragging),
                stacked: stackedLabels,
                'stacked-left': stackedLeft,
                'stacked-right': stackedRight,
              }
            )
          }
          enableResizing={{
            top: false,
            right: true,
            bottom: false,
            left: true,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          dragAxis="x"
          resizeHandleClasses={{
            left: 'libmr-AreaChart-resize-handler',
            right: 'libmr-AreaChart-resize-handler',
          }}
          resizeHandleStyles={{
            left: { top: -1, bottom: -1, height: 'auto' },
            right: { top: -1, bottom: -1, height: 'auto' },
          }}
        >
          <label className="libmr-AreaChart-label-min">
            {this.props.formatLabel(this.props.chartData[Math.ceil(sliderBounds.min)].x)}
          </label>
          <label className="libmr-AreaChart-label-max">
            {this.props.formatLabel(this.props.chartData[Math.floor(sliderBounds.max)].x)}
          </label>
        </Rnd>
      </div>
    );
  }
}
