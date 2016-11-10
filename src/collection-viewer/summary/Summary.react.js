import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import PieChart from '../../cgps-commons/PieChart.react';

import { getAssemblySummary } from './selectors';

function getAssemblySummarySlices(summary) {
  return summary.map(
    ([ colour, assemblies ]) => ({ colour, value: assemblies.length })
  );
}

const Summary = ({ summary }) => (
  <div
    className="wgsa-collection-viewer-summary mdl-shadow--4dp"
  >
    <PieChart
      slices={getAssemblySummarySlices(summary)}
      // borderColour="#fff"
      borderWidth={0}
      donut
    />
  </div>
);

function mapStateToProps(state) {
  return {
    summary: getAssemblySummary(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
