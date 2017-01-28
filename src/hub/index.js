import './css/index.css';

import { connect } from 'react-redux';

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

export default {
  path: 'upload',
  getComponent(_, cb) {
    System.import('./components/Hub.react').
      then(module => cb(null,
        connect(mapStateToProps)(module.default))
      );
  },
  getIndexRoute(_, cb) {
    System.import('./components/GridView.react').
      then(module => cb(null, {
        component: module.default,
      }));
  },
  getChildRoutes({ location }, cb) {
    if (location.pathname === '/upload/map') {
      System.import('./map').
        then(module => cb(null, { path: 'map', component: module.default }));
    }
    if (location.pathname === '/upload/stats') {
      System.import('./components/StatsView.react').
        then(module => cb(null, { path: 'stats', component: module.default }));
    }
  },
};
