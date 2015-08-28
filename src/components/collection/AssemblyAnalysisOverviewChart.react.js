import React from 'react';
import AnalysisUtils from '../../utils/Analysis';
import UploadStore from '../../stores/UploadStore';

import '../../css/upload-review.css';

const containerStyle = {
  margin: '0 0 25px 0',
  verticalAlign: 'top',
  textAlign: 'left'
};

const labelStyle = {
  fontSize: '15px',
  fontWeight: '300',
  lineHeight: '20px',
  color: '#777'
};

const numberStyle = {
  fontWeight: '400',
  fontSize: '24px'
};

const AssemblyAnalysisOverviewChart = React.createClass({

  propTypes: {
    label: React.PropTypes.string
  },


  draw: function() {
    var divElement = document.getElementsByClassName('n50-overview-chart')[0];
    var svgElement = divElement.childNodes[0];
    if (svgElement) {
      svgElement.parentNode.removeChild(svgElement);
    }

    const n50Data =  UploadStore.getAllContigN50Data();
    AnalysisUtils.drawN50OverviewChart(n50Data, '.n50-overview-chart');
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
        <label className='analysisItemLabel'>{this.props.label}</label>
        <div className="n50-overview-chart"></div>
      </div>
    );
  }
});

module.exports = AssemblyAnalysisOverviewChart;
