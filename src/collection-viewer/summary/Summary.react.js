import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import PieChart from '../../cgps-commons/PieChart.react';

import { getAssemblySummary, getIsSummaryExpanded } from './selectors';
import { toggleSummary } from './actions';

function getAssemblySummarySlices(summary) {
  return summary.map(
    ([ colour, assemblies ]) => ({ colour, value: assemblies.length })
  );
}

const Summary = ({ summary, isExpanded, onClick }) => (
  <div
    className={classnames(
      'wgsa-collection-viewer-summary mdl-shadow--4dp',
      { 'wgsa-collection-viewer-summary--expanded': isExpanded }
    )}
    onClick={() => onClick(!isExpanded)}
  >
    <PieChart
      slices={getAssemblySummarySlices(summary)}
      borderWidth={1}
    />
  </div>
);

function mapStateToProps(state) {
  return {
    summary: getAssemblySummary(state),
    isExpanded: getIsSummaryExpanded(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: (isExpanded) => dispatch(toggleSummary(isExpanded)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
