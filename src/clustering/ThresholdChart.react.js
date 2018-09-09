import React, { Component } from 'react';
import { connect } from 'react-redux';

import BarChart from './BarChart.react';
import { getClusterDescription } from './ClusterDescription.react';

import * as selectors from './selectors';

import { MAX_CLUSTER_SIZE } from './constants';

const renderTooltip = (data) => getClusterDescription(data.yLabel, data.xLabel);

const clickableStatuses = [
  'FAILED_BUILDING_CLUSTERS',
  'FAILED_FETCHING_CLUSTERS',
  'FAILED_FETCHING_EDGES',
  'COMPLETED_LAYOUT',
];

class ThresholdChart extends Component {

  onClick({ label }) {
    if (clickableStatuses.indexOf(this.props.status) === -1) return;
    const clusterSize = this.props.numberOfNodesAtThreshold[this.props.chartThresholds.indexOf(label)];
    if (clusterSize > MAX_CLUSTER_SIZE) {
      this.props.showToast('This cluster is too large to display, please select a lower threshold.');
      return;
    }
    this.props.setThreshold(label);
  }

  render() {
    if (!this.props.width) return null;

    return (
      <BarChart
        width={this.props.width || '100%'}
        height={100}
        labels={this.props.chartThresholds}
        values={this.props.chartValues}
        onClick={this.onClick}
        toolTipFunc={renderTooltip}
        backgroundColor={this.props.chartColours.status}
        hoverBackgroundColor={this.props.chartColours.hover}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    chartColours: selectors.getChartColours(state),
    chartThresholds: selectors.getChartThresholds(state),
    chartValues: selectors.getNumberOfGenomesAtThreshold(state),
    numberOfNodesAtThreshold: selectors.getNumberOfNodesAtThreshold(state),
  };
}

export default connect(mapStateToProps)(ThresholdChart);
