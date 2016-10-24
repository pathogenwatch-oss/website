import '../css/summary.css';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { Summary as FilterSummary, Totals } from '../../filter-summary';
import ProgressBar from '../../components/ProgressBar.react';

import * as selectors from '../selectors';
import { getNumberOfVisibleFastas } from '../../hub-filter/selectors';

const mapLocationFromState = ({ location }) => ({ location });

const ViewSwitcher = connect(mapLocationFromState)(({ icon, title, to }) => (
  <Link
    to={to}
    className="mdl-button mdl-button--icon wgsa-hub-view-switcher"
    activeClassName="wgsa-hub-view-switcher--active"
    onlyActiveOnIndex
    title={title}
  >
    <i className="material-icons">{icon}</i>
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
    return (
      <FilterSummary className="wgsa-hub-summary">
        { batchSize ?
          <ProgressBar
            className="wgsa-hub-upload-progress"
            progress={(completedUploads / batchSize) * 100}
            label={`${completedUploads}/${batchSize}`}
          /> :
          <Totals
            visible={visibleFastas}
            total={totalFastas}
            itemType="assemblies"
          />
        }
        <ViewSwitcher to="/upload" title="Grid view" icon="view_module" />
        <ViewSwitcher to="/upload/map" title="Map view" icon="map" />
        <ViewSwitcher
          to="/upload/stats"
          title="Stats view"
          icon="multiline_chart"
        />
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
