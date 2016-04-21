import '../../css/upload-review.css';

import React from 'react';

import ChartUtils from '^/utils/Chart';
import UploadStore from '^/stores/UploadStore';

import Species from '^/species';

const containerStyle = {
  margin: '0 0 25px 0',
  verticalAlign: 'top',
  textAlign: 'left',
};

function getChartBounds(chartType) {
  if (chartType === 'totalNumberOfNucleotidesInDnaStrings') {
    return {
      max: Species.maxAssemblySize,
    };
  }

  if (chartType === 'gcContent') {
    return Species.gcRange;
  }

  return {};
}

const AssemblyAnalysisOverviewChart = React.createClass({

  propTypes: {
    label: React.PropTypes.string,
    chartType: React.PropTypes.string,
  },

  draw() {
    const chartDiv = this.refs.chartDiv;
    if (chartDiv) {
      chartDiv.innerHTML = '';
    }

    ChartUtils.drawOverviewChart({
      data: UploadStore.getOverviewChartData(this.props.chartType),
      appendToClass: '.overview-chart',
      xLabel: 'Assemblies',
      yLabel: this.props.chartTitle,
      bounds: getChartBounds(this.props.chartType),
    });
  },

  componentDidMount() {
    this.draw();
    window.addEventListener('resize', this.handleResize);
  },

  componentDidUpdate() {
    this.draw();
  },

  handleResize(e) {
    this.draw();
  },

  render() {
    return (
      <div style={containerStyle}>
        <label className="metricsItemLabel">{this.props.label}</label>
        <div ref="chartDiv" className="overview-chart"></div>
      </div>
    );
  },

});

module.exports = AssemblyAnalysisOverviewChart;
