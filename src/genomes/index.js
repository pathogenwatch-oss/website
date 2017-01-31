import './css/index.css';

import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { connect } from 'react-redux';

import Hub from './components/Hub.react';
import GridView from './components/GridView.react';
import MapView from './map';
import StatsView from './components/StatsView.react';

import { getCollection } from '../collection-route/selectors';
import { getTotalFastas } from './selectors';
import { getNumberOfVisibleFastas } from '../genomes/filter/selectors';

function mapStateToProps(state) {
  const { hub } = state;
  return {
    hasFastas: getTotalFastas(state) > 0,
    hasVisibleFastas: getNumberOfVisibleFastas(state) > 0,
    loading: hub.loading,
    collection: getCollection(state),
  };
}

const Genomes = connect(mapStateToProps)(Hub);

export reducer from './reducers';

export default (
  <Route path="genomes" component={Genomes}>
    <IndexRoute component={GridView} />
    <Route path="map" component={MapView} />
    <Route path="stats" component={StatsView} />
    <Route path="upload" component={() => 'upload'} />
  </Route>
);
