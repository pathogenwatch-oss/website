import './css/index.css';

import { connect } from 'react-redux';

import Hub from './components/Hub.react';
export GridView from './components/GridView.react';
export MapView from './components/MapView.react';
export StatsView from './components/StatsView.react';

import { getNumberOfVisibleFastas, isFilterActive }
  from '../hub-filter/selectors';

function mapStateToProps(state) {
  const { hub, collection } = state;
  return {
    hasFastas: getNumberOfVisibleFastas(state) > 0,
    filterActive: isFilterActive(state),
    loading: hub.loading,
    collection,
  };
}

export default connect(mapStateToProps)(Hub);
