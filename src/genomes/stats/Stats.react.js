/* global Chart */

import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { AutoSizer } from 'react-virtualized';

import ChartResizer from '../../components/chart-resizer';

import * as selectors from './selectors';
import { getFilter } from '../filter/selectors';

import { showGenomeReport } from '../../genome-report';
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

export const StatsView = React.createClass({

  componentDidMount() {
    const { chartData = [], previousFilter, filter, fetch, count } = this.props;

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
        responsive: false,
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
              ticks: { display: false, min: 0, max: count + 1 },
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
    const { chartData, onPointClick, filter, fetch, count } = this.props;

    if (previous.filter !== filter) {
      fetch();
      return;
    }

    if (chartData !== previous.chartData) {
      this.chart.data.datasets = chartData;
      this.chart.options.onClick = getClickHandler(chartData, onPointClick);
      this.chart.options.scales.xAxes[0].ticks.max = count + 1;
      this.chart.update();
      this.chart.resize();
    }
  },

  render() {
    const { average, stDev, range = {} } = this.props;

    return (
      <div className="wgsa-genome-stats">
        <AutoSizer>
          {({ height, width }) =>
            <div style={{ height, width, position: 'relative' }}>
              <nav className="wgsa-button-group">
                <i title="Metric" className="material-icons">timeline</i>
                {charts.map(props =>
                  <ChartButton key={props.metric} {...props} />
                )}
              </nav>
              <ChartResizer
                className="wgsa-stats-chart"
                height={height - 184}
                width={width - 8}
                chart={this.chart}
              >
                <canvas ref={el => { this.canvas = el; }} />
              </ChartResizer>
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
                    {range.min} &ndash; {range.max}
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
    count: selectors.getNumberOfDatapoints(state),
    filter: getFilter(state),
    previousFilter: selectors.getFilter(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onPointClick: item => dispatch(showGenomeReport(item.id, item.label)),
    fetch: () => dispatch(fetchGenomeStats()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsView);
