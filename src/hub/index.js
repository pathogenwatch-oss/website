import './style.css';

import { connect } from 'react-redux';

import Hub from './components/Hub.react';
export GridView from './components/GridView.react';
export MapView from './components/MapView.react';
export StatsView from './components/StatsView.react';

import * as selectors from './selectors';

function mapStateToProps(state) {
  const { hub, collection } = state;
  return {
    totalFastas: selectors.getTotalFastas(state),
    fastas: selectors.getVisibleFastas(state),
    filterActive: selectors.isFilterActive(state),
    uploads: hub.uploads,
    loading: hub.loading,
    collection,
  };
}

export default connect(mapStateToProps)(Hub);
