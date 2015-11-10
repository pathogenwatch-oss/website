import '../../css/upload-review.css';

import React from 'react';
import ChartUtils from '^/utils/Chart';

const containerStyle = {
  margin: '0 0 25px 0',
  verticalAlign: 'top',
  textAlign: 'left',
};

const labelStyle = {
  fontSize: '15px',
  fontWeight: '300',
  lineHeight: '20px',
  textTransform: 'uppercase',
  color: '#777',
};

const AssemblyAnalysisChart = React.createClass({

  propTypes: {
    label: React.PropTypes.string,
    metrics: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      isChartDataAvailable: false
    };
  },

  getChartDataWithN50Data(N50Data) {
    const chartData = [];
    for (const id in N50Data) {
      chartData.push(N50Data[id].sum);
    }
    return chartData;
  },

  draw() {
    var divElement = document.getElementsByClassName('fasta-analytics-chart')[0];
    var svgElement;
    if (divElement) {
      svgElement = divElement.childNodes[0];
      if (svgElement) {
        svgElement.parentNode.removeChild(svgElement);
      }
    }

    const fastaChartData = this.props.metrics.sumsOfNucleotidesInDnaStrings;
    const assemblyN50 = this.props.metrics.assemblyN50Data;
    ChartUtils.drawN50Chart(fastaChartData, assemblyN50, '.fasta-analytics-chart');
  },

  handleResize(e) {
    this.draw();
  },

  componentDidUpdate() {
    this.draw();
  },

  componentDidMount() {
    if (Object.keys(this.props.metrics).length > 0) {
      this.setState({
        isChartDataAvailable: true
      });
      this.draw();
    }
    window.addEventListener('resize', this.handleResize);
  },

  render() {
    if (Object.keys(this.props.metrics).length > 0) {
      return (
        <div style={containerStyle}>
          <label className='metricsItemLabel'>{this.props.label}</label>
          <div className="fasta-analytics-chart"></div>
        </div>
      );
    }

    return (
      <p className="mdl-card__supporting-text">(Assembly not provided)</p>
    );
  },

});

module.exports = AssemblyAnalysisChart;
