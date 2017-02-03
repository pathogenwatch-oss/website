import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Genomes from './component';
import GridView from './grid';
import MapView from './map';
import StatsView from './stats';

export reducer from './reducer';

export default (
  <Route path="genomes" component={Genomes}>
    <IndexRoute component={GridView} />
    <Route path="map" component={MapView} />
    <Route path="stats" component={StatsView} />
  </Route>
);
