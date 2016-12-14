import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import PieChart from '../../cgps-commons/PieChart.react';
import ChipButton from '../../cgps-commons/ChipButton.react';

import { activateFilter } from '../filter/actions';

import { getAssemblySummary, getIsSummaryExpanded } from './selectors';
import { toggleSummary } from './actions';

function getAssemblySummarySlices(summary) {
  return summary.map(
    ([ colour, assemblies ]) => ({ colour, value: assemblies.length, assemblies })
  );
}

import { getColourState, nonResistantColour } from '../resistance-profile/utils';

const Summary = ({ summary, isExpanded, onClick, onSliceClick }) => (
  <div
    title={!isExpanded ? 'Summary' : ''}
    className={classnames(
      'wgsa-collection-viewer-summary mdl-shadow--2dp',
      { 'wgsa-collection-viewer-summary--expanded': isExpanded }
    )}
    onClick={() => onClick(!isExpanded)}
  >
    <PieChart
      className="wgsa-summary-chart"
      slices={getAssemblySummarySlices(summary)}
      borderWidth={1.5}
      onSliceClick={(slice, event) => {
        if (isExpanded) {
          event.preventDefault();
          event.stopPropagation();
          onSliceClick(slice.assemblies.map(_ => _.uuid));
        }
      }}
    />
    <div className="wgsa-summary-list">
      {summary.map(([ colour, assemblies ], index) =>
        getColourState(colour) &&
          <ChipButton
            key={index}
            className={classnames(
              'wgsa-summary-list__chip',
              { 'mdl-chip--inverse': colour === nonResistantColour }
            )}
            text={getColourState(colour)}
            contact={assemblies.length}
            contactStyle={{ background: colour }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onSliceClick(assemblies.map(_ => _.uuid));
            }}
          />
      )}
    </div>
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
