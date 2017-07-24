import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import Sunburst from '../components/sunburst';
import * as upload from './selectors';

const Progress = ({ summary }) => (
  <div className="wgsa-content-margin">
    <Sunburst data={summary} />
  </div>
);

function formatSunburstData(data) {
  return {
    name: 'sunburst',
    children: data.map(({ organismId, organismName, sequenceTypes }) =>
      ({
        name: `${organismName} (${organismId})`,
        children: sequenceTypes.map(({ st, total }) => ({ name: `ST: ${st}`, size: total })),
      })
    ),
  };
}

function mapStateToProps(state) {
  return {
    summary: formatSunburstData(upload.getAnalysisSummary(state)),
  };
}

export default connect(mapStateToProps)(Progress);
