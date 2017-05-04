import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Chart from 'chart.js';

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

export const StatsView = React.createClass({

  componentDidMount() {
    const { chartData = [] } = this.props;
    this.chart = new Chart(this.canvas, {
      type: 'line',
      data: { datasets: [ chartData ] },
      options: {
        animation: false,
        showLines: false,
        legend: {
          display: false,
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
        elements: {
          points: {
            borderWidth: 1,
            backgroundColor: '#a386bd',
            borderColor: '#a386bd',
          },
        },
      },
    });
  },

  componentDidUpdate(previous) {
    const { chartData } = this.props;
    if (chartData !== previous.chartData) {
      this.chart.data.datasets = [ chartData ];
      this.chart.update();
    }
  },

  render() {
    const { average, stDev, range = {} } = this.props;
    return (
      <div className="wgsa-hub-stats-view">
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
            <dd className="wgsa-hub-stats-value wgsa-hub-stats-value--large">{average}</dd>
          </dl>
          <dl className="wgsa-hub-stats-section">
            <dt className="wgsa-hub-stats-heading">Standard Deviation</dt>
            <dd className="wgsa-hub-stats-value wgsa-hub-stats-value--large">{stDev}</dd>
          </dl>
          <dl className="wgsa-hub-stats-section">
            <dt className="wgsa-hub-stats-heading">Range</dt>
            <dd className="wgsa-hub-stats-value wgsa-hub-stats-value--large">
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
    onPointClick: ({ id }) => dispatch(showGenomeDrawer(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsView);
