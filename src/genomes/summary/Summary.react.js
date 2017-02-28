import React from 'react';
import { connect } from 'react-redux';

import { Summary as FilterSummary, Totals } from '../../filter/viewing';
import ProgressBar from '../../progress-bar';
import ViewSwitcher from './ViewSwitcher.react';

import { getPrefilter } from '../filter/selectors';
import { isUploading, getBatchSize, getNumCompletedUploads } from '../uploads/selectors';
import { getTotalGenomes } from '../selectors';
import { getTotal } from './selectors';

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
    const { isUploading, completedUploads, batchSize, visibleGenomes, totalGenomes } = this.props;
    return (
      <FilterSummary className="wgsa-hub-summary">
        { isUploading ?
            <ErrorSummary /> :

        }
        <div className="wgsa-button-group">
          <i className="material-icons" title="View">visibility</i>
          <ViewSwitcher title="Grid" />
          <ViewSwitcher view="map" title="Map" />
          <ViewSwitcher view="stats" title="Stats" />
        </div>
        { isUploading ?
          <ProgressBar
            className="wgsa-filter-summary__count"
            progress={(completedUploads / batchSize) * 100}
            label={`${completedUploads}/${batchSize}`}
          /> :
          <Totals
            visible={visibleGenomes}
            total={totalGenomes}
            itemType="genome"
          />
        }
      </FilterSummary>
    );
  },

});

function mapStateToProps(state) {
  return {
    prefilter: getPrefilter(state),
    isUploading: isUploading(state),
    batchSize: getBatchSize(state),
    completedUploads: getNumCompletedUploads(state),
    visibleGenomes: getTotalGenomes(state),
    totalGenomes: getTotal(state),
  };
}

export default connect(mapStateToProps)(Summary);
