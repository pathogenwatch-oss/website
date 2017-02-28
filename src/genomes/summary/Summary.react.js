import React from 'react';
import { connect } from 'react-redux';

import { Summary as FilterSummary, Totals } from '../../filter/viewing';
import ProgressBar from '../../progress-bar';
import ViewSwitcher from './ViewSwitcher.react';
import ErrorSummary from '../uploads/ErrorSummary.react';

import { getPrefilter } from '../filter/selectors';
import * as uploads from '../uploads/selectors';
import { getTotalGenomes, getStatus } from '../selectors';
import { getTotal } from './selectors';

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

    if (status !== statuses.OK || this.props.visibleGenomes === 0) {
      return <FilterSummary />;
    }

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

    return (
      <FilterSummary className="wgsa-hub-summary">
        <div className="wgsa-button-group">
          <i className="material-icons" title="View">visibility</i>
          <ViewSwitcher title="Grid" />
          <ViewSwitcher view="map" title="Map" />
          <ViewSwitcher view="stats" title="Stats" />
        </div>
        <Totals
          visible={this.props.visibleGenomes}
          total={this.props.totalGenomes}
          itemType="genome"
        />
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
    visibleGenomes: getTotalGenomes(state),
    totalGenomes: getTotal(state),
    status: getStatus(state),
  };
}

export default connect(mapStateToProps)(Summary);
