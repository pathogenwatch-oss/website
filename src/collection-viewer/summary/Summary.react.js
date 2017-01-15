import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import PieChart from '../../cgps-commons/PieChart.react';
import ChipButton from '../../cgps-commons/ChipButton.react';

import { activateFilter } from '../filter/actions';

import { getGenomeSummary, getIsSummaryExpanded } from './selectors';
import { toggleSummary } from './actions';

function getGenomeSummarySlices(summary) {
  return summary.map(
    ([ colour, genomes ]) => ({ colour, value: genomes.length, genomes })
  );
}

import { getColourState, nonResistantColour } from '../amr-utils';

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
      slices={getGenomeSummarySlices(summary)}
      borderWidth={1.5}
      onSliceClick={(slice, event) => {
        if (isExpanded) {
          event.preventDefault();
          event.stopPropagation();
          onSliceClick(slice.genomes.map(_ => _.uuid));
        }
      }}
    />
    <div className="wgsa-summary-list">
      {summary.map(([ colour, genomes ], index) =>
        getColourState(colour) &&
          <ChipButton
            key={index}
            className={classnames(
              'wgsa-summary-list__chip',
              { 'mdl-chip--inverse': colour === nonResistantColour }
            )}
            text={getColourState(colour)}
            contact={genomes.length}
            contactStyle={{ background: colour }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onSliceClick(genomes.map(_ => _.uuid));
            }}
          />
      )}
    </div>
  </div>
);

function mapStateToProps(state) {
  return {
    summary: getGenomeSummary(state),
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
