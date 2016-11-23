import './css/index.css';

import { connect } from 'react-redux';

import { getTotalFastas } from './selectors';
import { getNumberOfVisibleFastas } from '../hub-filter/selectors';

function mapStateToProps(state) {
  const { hub, collection } = state;
  return {
    hasFastas: getTotalFastas(state) > 0,
    hasVisibleFastas: getNumberOfVisibleFastas(state) > 0,
    loading: hub.loading,
    collection,
  };
}

export default {
  path: 'upload',
  getComponent(_, cb) {
    return require.ensure([], require => cb(null,
      connect(mapStateToProps)(require('./components/Hub.react').default))
    );
  },
  getIndexRoute(_, cb) {
    return require.ensure([], require => cb(null, {
      component: require('./components/GridView.react').default,
    }));
  },
  getChildRoutes({ location }, cb) {
    require.ensure([], require => {
      if (location.pathname === '/upload/map') {
        cb(null, { path: 'map', component: require('./map').default });
      }
      if (location.pathname === '/upload/stats') {
        cb(null, { path: 'stats', component: require('./components/StatsView.react').default });
      }
    });
  },
};
