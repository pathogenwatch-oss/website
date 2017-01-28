import '../css/summary.css';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router/es';

import { Summary as FilterSummary, Totals } from '../../filter-summary';
import ProgressBar from '../../components/progress-bar';

import * as selectors from '../selectors';
import { getNumberOfVisibleFastas } from '../../hub-filter/selectors';

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
    const { completedUploads, batchSize, visibleFastas, totalFastas } = this.props;
    if (totalFastas === 0) return <FilterSummary />;
    return (
      <FilterSummary className="wgsa-hub-summary">
        <div className="wgsa-button-group">
          <i className="material-icons" title="View">visibility</i>
          <ViewSwitcher to="/upload" title="Grid" />
          <ViewSwitcher to="/upload/map" title="Map" />
          <ViewSwitcher to="/upload/stats" title="Stats" />
        </div>
        { batchSize ?
          <ProgressBar
            className="wgsa-filter-summary__count"
            progress={(completedUploads / batchSize) * 100}
            label={`${completedUploads}/${batchSize}`}
          /> :
          <Totals
            visible={visibleFastas}
            total={totalFastas}
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
    visibleFastas: getNumberOfVisibleFastas(state),
    totalFastas: selectors.getTotalFastas(state),
  };
}

export default connect(mapStateToProps)(Summary);
