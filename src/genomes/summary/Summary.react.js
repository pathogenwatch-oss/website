import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { Summary as FilterSummary, Totals } from '../../filter-summary';
import ProgressBar from '../../components/progress-bar';

import * as selectors from '../selectors';
import { getNumberOfVisibleGenomes } from '../filter/selectors';

const mapLocationFromState = ({ location }) => ({ location });

const ViewSwitcher = connect(mapLocationFromState)(({ title, to }) => (
  <Link
    to={to}
    className="wgsa-button-group__item"
    activeClassName="active"
    onlyActiveOnIndex
  >
    {title}
  </Link>
));

const Summary = React.createClass({

  componentDidUpdate() {
    const { completedUploads, batchSize } = this.props;
    document.title = [
      'WGSA',
      '|',
      batchSize ? `(${completedUploads}/${batchSize})` : '',
      'Upload',
    ].join(' ');
  },

  render() {
    const { completedUploads, batchSize, visibleGenomes, totalGenomes } = this.props;
    // if (totalGenomes === 0) return <FilterSummary />;
    return (
      <FilterSummary className="wgsa-hub-summary">
        <div className="wgsa-button-group">
          <i className="material-icons" title="View">visibility</i>
          <ViewSwitcher to="/genomes" title="Grid" />
          <ViewSwitcher to="/genomes/map" title="Map" />
          <ViewSwitcher to="/genomes/stats" title="Stats" />
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
    visibleGenomes: getNumberOfVisibleGenomes(state),
    totalGenomes: selectors.getTotalGenomes(state),
  };
}

export default connect(mapStateToProps)(Summary);
