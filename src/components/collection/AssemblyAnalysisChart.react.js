import '../../css/upload-review.css';

import React from 'react';
import AnalysisUtils from '../../utils/Analysis';

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
    analysis: React.PropTypes.object.isRequired,
  },

  getInitialState: function() {
    return {
      isChartDataAvailable: false
    };
  },

  getChartDataWithN50Data: function(N50Data) {
    const chartData = [];
    for (const id in N50Data) {
      chartData.push(N50Data[id].sum);
    }
    return chartData;
  },

  draw: function() {
    var divElement = document.getElementsByClassName('fasta-analytics-chart')[0];
    var svgElement;
    if(divElement) {
      svgElement = divElement.childNodes[0];
      if (svgElement) {
        svgElement.parentNode.removeChild(svgElement);
      }
    }

    const fastaChartData = this.props.analysis.sumsOfNucleotidesInDnaStrings;
    const assemblyN50 = this.props.analysis.assemblyN50Data;
    AnalysisUtils.drawN50Chart(fastaChartData, assemblyN50, '.fasta-analytics-chart');
  },

  handleResize(e) {
    this.draw();
  },

  componentDidUpdate: function() {
    this.draw();
  },

  componentDidMount: function() {
    if (Object.keys(this.props.analysis).length > 0) {
      this.setState({
        isChartDataAvailable: true
      })
      this.draw();
    }
    window.addEventListener('resize', this.handleResize);
  },

  render: function () {
    if (Object.keys(this.props.analysis).length > 0) {
      return (
        <div style={containerStyle}>
          <label className='analysisItemLabel'>{this.props.label}</label>
          <div className="fasta-analytics-chart"></div>
        </div>
      );
    }

    return (
      <div style={labelStyle}>No data available</div>
    );
  }
});

module.exports = AssemblyAnalysisChart;
