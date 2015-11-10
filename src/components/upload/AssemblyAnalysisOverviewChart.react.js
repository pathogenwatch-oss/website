import React from 'react';
import ChartUtils from '^/utils/Chart';
import UploadStore from '^/stores/UploadStore';

import '../../css/upload-review.css';

const containerStyle = {
  margin: '0 0 25px 0',
  verticalAlign: 'top',
  textAlign: 'left',
};

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

    const chartData =  UploadStore.getOverviewChartData(this.props.chartType);
    ChartUtils.drawOverviewChart(chartData, '.overview-chart', 'Assemblies', this.props.chartTitle);
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
