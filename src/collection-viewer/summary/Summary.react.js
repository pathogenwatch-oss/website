import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import PieChart from '../../cgps-commons/PieChart.react';

import { activateFilter } from '../filter/actions';

import { getAssemblySummary, getIsSummaryExpanded } from './selectors';
import { toggleSummary } from './actions';

function getAssemblySummarySlices(summary) {
  return summary.map(
    ([ colour, assemblies ]) => ({ colour, value: assemblies.length, assemblies })
  );
}

const Summary = ({ summary, isExpanded, onClick, onSliceClick }) => (
  <div
    className={classnames(
      'wgsa-collection-viewer-summary mdl-shadow--4dp',
      { 'wgsa-collection-viewer-summary--expanded': isExpanded }
    )}
    onClick={() => onClick(!isExpanded)}
  >
    <PieChart
      slices={getAssemblySummarySlices(summary)}
      borderWidth={1.5}
      onSliceClick={(slice, event) => {
        if (isExpanded) {
          event.preventDefault();
          event.stopPropagation();
        }
        onSliceClick(
          slice.assemblies.map(({ metadata }) => metadata.assemblyId)
        );
      }}
    />
    <ul className="wgsa-collection-viewer-summary-list">
      {summary.map(([ colour, assemblies ], index) =>
        <li key={index}>{colour}: {assemblies.length}</li>
      )}
    </ul>
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
    onSliceClick: (ids) => dispatch(activateFilter(ids)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
