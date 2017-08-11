/* global Chart */

import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { AutoSizer } from 'react-virtualized';

import * as selectors from './selectors';
import { getFilter } from '../filter/selectors';

import { showGenomeDrawer } from '../../genome-drawer';
import { showMetric } from './actions';
import { fetchGenomeStats } from '../actions';

const charts = [
  { title: 'Genome Length', metric: 'length' },
  { title: 'N50', metric: 'N50' },
  { title: 'No. Contigs', metric: 'contigs' },
  { title: 'Non-ATCG', metric: 'nonATCG' },
  { title: 'GC Content', metric: 'gcContent' },
];

const mapStateToButton = (state, ownProps) => {
  const selectedMetric = selectors.getSelectedMetric(state);
  return {
    className: selectedMetric === ownProps.metric ? 'active' : '',
  };
};

function mapDispatchToButton(dispatch, ownProps) {
  return {
    onClick: () => dispatch(showMetric(ownProps.metric)),
  };
}

const ChartButton = connect(mapStateToButton, mapDispatchToButton)(
  ({ title, className, onClick }) => (
    <button className={classnames('wgsa-button-group__item', className)} onClick={onClick}>
      {title}
    </button>
  )
);

function getClickHandler(chartData, onPointClick) {
  return (event, [ item ]) => {
    if (item) {
      const original = chartData[item._datasetIndex].data[item._index];
      onPointClick(original);
    }
  };
}

const ChartResizer = React.createClass({

  componentDidUpdate(previous) {
    const { width, height, chart } = this.props;

    if (!chart) return;

    if (width !== previous.width || height !== previous.height) {
      chart.resize();
    }
  },

  render() {
    const { width, height } = this.props;
    return (
      <div className="wgsa-stats-chart" style={{ width, height }}>
        {this.props.children}
      </div>
    );
  },

});

export const StatsView = React.createClass({

  componentDidMount() {
    const { chartData = [], previousFilter, filter, fetch } = this.props;

    let data;
    if (previousFilter !== filter) {
      fetch();
    } else {
      data = { datasets: chartData };
    }

    this.chart = new Chart(this.canvas, {
      type: 'line',
      data,
      options: {
        animation: false,
        elements: {
          points: {
            borderWidth: 1,
            backgroundColor: '#a386bd',
            borderColor: '#a386bd',
          },
        },
        hover: {
          mode: 'point',
          intersect: true,
        },
        legend: {
          display: false,
        },
        maintainAspectRatio: false,
        onClick: getClickHandler(chartData, this.props.onPointClick),
        showLines: false,
        scales: {
          xAxes: [
            {
              type: 'linear',
              position: 'bottom',
              ticks: { display: false },
              scaleLabel: { display: false },
              beginAtZero: true,
            },
          ],
        },
        tooltips: {
          displayColors: false,
          callbacks: {
            title: (points, { datasets }) =>
              points.map(({ index, datasetIndex }) =>
              datasets[datasetIndex].data[index].label
            ).join(', '),
            label: ({ index, datasetIndex }, { datasets }) =>
            datasets[datasetIndex].data[index].y,
          },
        },
      },
    });
  },

  componentDidUpdate(previous) {
    const { chartData, onPointClick, filter, fetch } = this.props;

    if (previous.filter !== filter) {
      fetch();
    }

    if (chartData !== previous.chartData) {
      this.chart.data.datasets = chartData;
      this.chart.options.onClick = getClickHandler(chartData, onPointClick);
      this.chart.update();
    }
  },

  render() {
    const { average, stDev, range = {} } = this.props;

    return (
      <div className="wgsa-hub-stats-view wgsa-content-margin">
        <AutoSizer>
          {({ height, width }) =>
            <div style={{ height, width, position: 'relative' }}>
              <div className="wgsa-hub-stats-section">
                <nav className="wgsa-button-group">
                  <i title="Metric" className="material-icons">timeline</i>
                  {charts.map(props =>
                    <ChartButton key={props.metric} {...props} />
                  )}
                </nav>
                <ChartResizer height={height - 184} width={width} chart={this.chart}>
                  <canvas ref={el => { this.canvas = el; }} />
                </ChartResizer>
              </div>
              <div className="wgsa-hub-stats-group">
                <dl className="wgsa-hub-stats-section">
                  <dt className="wgsa-hub-stats-heading">Average</dt>
                  <dd className="wgsa-hub-stats-value">{average}</dd>
                </dl>
                <dl className="wgsa-hub-stats-section">
                  <dt className="wgsa-hub-stats-heading">Standard Deviation</dt>
                  <dd className="wgsa-hub-stats-value">{stDev}</dd>
                </dl>
                <dl className="wgsa-hub-stats-section">
                  <dt className="wgsa-hub-stats-heading">Range</dt>
                  <dd className="wgsa-hub-stats-value">
                    {`${range.min} - ${range.max}`}
                  </dd>
                </dl>
              </div>
            </div>
          }
        </AutoSizer>
      </div>
    );
  },

});

function mapStateToProps(state) {
  return {
    average: selectors.getMetricAverage(state),
    stDev: selectors.getMetricStDev(state),
    range: selectors.getMetricRange(state),
    chartData: selectors.getChartData(state),
    filter: getFilter(state),
    previousFilter: selectors.getFilter(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onPointClick: item => dispatch(showGenomeDrawer(item.id, item.label)),
    fetch: () => dispatch(fetchGenomeStats()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsView);
