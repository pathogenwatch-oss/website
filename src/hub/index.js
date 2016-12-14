import './css/index.css';

import { connect } from 'react-redux';

import Hub from './components/Hub.react';
export GridView from './components/GridView.react';
export MapView from './map';
export StatsView from './components/StatsView.react';

export reducer from './reducers';

import { getCollection } from '../collection-route/selectors';
import { getTotalFastas } from './selectors';
import { getNumberOfVisibleFastas } from '../hub-filter/selectors';

function mapStateToProps(state) {
  const { hub } = state;
  return {
    hasFastas: getTotalFastas(state) > 0,
    hasVisibleFastas: getNumberOfVisibleFastas(state) > 0,
    loading: hub.loading,
    collection: getCollection(state),
  };
}

export default connect(mapStateToProps)(Hub);
