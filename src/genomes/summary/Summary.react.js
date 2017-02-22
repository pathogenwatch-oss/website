import React from 'react';
import { connect } from 'react-redux';

import { Summary as FilterSummary, Totals } from '../../filter-summary';
import ProgressBar from '../../progress-bar';
import ViewSwitcher from './ViewSwitcher.react';

import { getFilter } from '../../filter/selectors';
import * as selectors from '../selectors';
import { getTotal } from './selectors';

import { stateKey } from '../filter';

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
    const { completedUploads, batchSize, visibleGenomes, totalGenomes } = this.props;
    return (
      <FilterSummary className="wgsa-hub-summary">
        <div className="wgsa-button-group">
          <i className="material-icons" title="View">visibility</i>
          <ViewSwitcher title="Grid" />
          <ViewSwitcher view="map" title="Map" />
          <ViewSwitcher view="stats" title="Stats" />
        </div>
        { batchSize ?
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
    batchSize: selectors.getBatchSize(state),
    completedUploads: selectors.getNumCompletedUploads(state),
    visibleGenomes: selectors.getTotalGenomes(state),
    totalGenomes: getTotal(state),
    isUpload: getFilter(state, { stateKey }).upload,
  };
}

export default connect(mapStateToProps)(Summary);
