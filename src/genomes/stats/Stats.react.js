/* global Chart */

import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import * as selectors from './selectors';

import { showGenomeDrawer } from '../../genome-drawer';
import { showMetric } from './actions';

const charts = [
  { title: 'Genome Length', metric: 'totalNumberOfNucleotidesInDnaStrings' },
  { title: 'N50', metric: 'contigN50' },
  { title: 'No. Contigs', metric: 'totalNumberOfContigs' },
  { title: 'Non-ATCG', metric: 'totalNumberOfNsInDnaStrings' },
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
      onPointClick(original.id);
    }
  };
}

export const StatsView = React.createClass({

  componentDidMount() {
    const { chartData = [] } = this.props;
    this.chart = new Chart(this.canvas, {
      type: 'line',
      data: { datasets: chartData },
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
    const { chartData, onPointClick } = this.props;
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
        <div className="wgsa-hub-stats-section">
          <nav className="wgsa-button-group">
            <i title="Metric" className="material-icons">timeline</i>
            {charts.map(props =>
              <ChartButton key={props.metric} {...props} />
            )}
          </nav>
          <canvas ref={el => { this.canvas = el; }} width="400" height="160" />
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
    );
  },

});

function mapStateToProps(state) {
  return {
    average: selectors.getMetricAverage(state),
    stDev: selectors.getMetricStDev(state),
    range: selectors.getMetricRange(state),
    chartData: selectors.getChartData(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onPointClick: id => dispatch(showGenomeDrawer(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsView);
