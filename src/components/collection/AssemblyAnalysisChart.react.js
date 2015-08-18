var React = require('react');
var AnalysisUtils = require('../../utils/Analysis');
import '../../css/UploadReview.css';

var containerStyle = {
  margin: '0 0 25px 0',
  verticalAlign: 'top',
  textAlign: 'left'
};

var labelStyle = {
  fontSize: '15px',
  fontWeight: '300',
  lineHeight: '20px',
  textTransform: 'uppercase',
  color: '#777'
};

var numberStyle = {
  fontWeight: '400',
  fontSize: '24px'
};

var AssemblyAnalysisChart = React.createClass({

  propTypes: {
    label: React.PropTypes.string,
    analysis: React.PropTypes.object.isRequired
  },

  draw: function() {
    var chartData = this.props.analysis.sumsOfNucleotidesInDnaStrings;
    var assemblyN50 = this.props.analysis.assemblyN50Data;
    AnalysisUtils.drawN50Chart(chartData, assemblyN50, '.fasta-analytics-chart');
  },

  componentDidUpdate: function() {
    this.draw();
  },

  componentDidMount: function() {
    this.draw();
  },

  render: function () {
    return (
      <div style={containerStyle}>
        <div style={labelStyle}>{this.props.label}</div>
        <div style={numberStyle} className="fasta-analytics-chart"></div>
      </div>
    );
  }
});

module.exports = AssemblyAnalysisChart;
