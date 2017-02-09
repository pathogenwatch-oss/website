import React from 'react';
import { Route, Redirect, IndexRoute, IndexRedirect } from 'react-router';

import Genomes from './component';
import GridView from './grid';
import MapView from './map';
import StatsView from './stats';

import { prefilters } from './filter';

export reducer from './reducer';

export default (
  <Route path="genomes">
    { Object.keys(prefilters).map(prefilter =>
      <Route key={prefilter} path={prefilter}
        component={props => <Genomes {...props} prefilter={prefilter} />}
      >
        <IndexRoute component={GridView} />
        <Route path="map" component={MapView} />
        <Route path="stats" component={StatsView} />
      </Route>
    )}
    <Redirect from="*" to="all" />
    <IndexRedirect to="all" />
  </Route>
);
