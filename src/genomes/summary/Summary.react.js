import React from 'react';
import { connect } from 'react-redux';

import { Summary as FilterSummary, Totals } from '../../filter/summary';
import ProgressBar from '../../progress-bar';
import ViewSwitcher from './ViewSwitcher.react';
import ErrorSummary from '../uploads/ErrorSummary.react';
import SortBy from './SortBy.react';

import { getPrefilter } from '../filter/selectors';
import * as uploads from '../uploads/selectors';
import { getTotalGenomes, getStatus } from '../selectors';
import { getTotal } from './selectors';
import { getSelectedGenomeList } from '../selection/selectors';

import { selectAll, setSelection } from '../selection/actions';

import { statuses } from '../constants';

const Summary = React.createClass({

  componentDidUpdate() {
    const { completedUploads, batchSize } = this.props;
    document.title = [
      'WGSA',
      '|',
      batchSize ? `(${completedUploads}/${batchSize})` : '',
      'Genomes',
    ].join(' ');
  },

  render() {
    const { status, completedUploads, batchSize, prefilter } = this.props;

    if (prefilter === 'upload') {
      if (this.props.isUploading) {
        return (
          <FilterSummary className="wgsa-hub-summary">
            <ProgressBar
              className="wgsa-filter-summary__count"
              progress={(completedUploads / batchSize) * 100}
              label={`${completedUploads}/${batchSize}`}
            />
          </FilterSummary>
        );
      }

      if (this.props.totalErroredUploads > 0) {
        return <ErrorSummary />;
      }
    }

    if (status !== statuses.OK || this.props.numVisibleGenomes === 0) {
      return <FilterSummary />;
    }

    return (
      <FilterSummary className="wgsa-hub-summary">
        <div className="wgsa-button-group">
          <i className="material-icons" title="View">visibility</i>
          <ViewSwitcher title="Grid" />
          <ViewSwitcher view="list" title="List" />
          <ViewSwitcher view="map" title="Map" />
          <ViewSwitcher view="stats" title="Stats" />
        </div>
        <Totals
          visible={this.props.numVisibleGenomes}
          total={this.props.totalGenomes}
          itemType="genome"
        />
        { this.props.hasSelection ?
            <button className="mdl-button" onClick={this.props.onClearAll}>
              Clear Selection
            </button> :
            <button
              className="mdl-button mdl-button--primary"
              onClick={this.props.onSelectAll}
            >
              Select All
            </button> }
        <SortBy />
      </FilterSummary>
    );
  },

});

function mapStateToProps(state) {
  return {
    prefilter: getPrefilter(state),
    isUploading: uploads.isUploading(state),
    batchSize: uploads.getBatchSize(state),
    completedUploads: uploads.getNumCompletedUploads(state),
    totalErroredUploads: uploads.getTotalErrors(state),
    numVisibleGenomes: getTotalGenomes(state),
    totalGenomes: getTotal(state),
    status: getStatus(state),
    hasSelection: getSelectedGenomeList(state).length > 0,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSelectAll: () => dispatch(selectAll()),
    onClearAll: () => dispatch(setSelection([])),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
