import React from 'react';
import { Router, Route, IndexRoute, browserHistory, Redirect } from 'react-router';

import App from './App';
import Home from './components/Home.react';
import SpeciesHome from './components/SpeciesHome.react';
import hub, { GridView, MapView, StatsView } from './hub';
import ExploreCollection from './components/explorer';
import NotFound from './components/NotFound.react';

import Species from './species';

const SpeciesSetter = ({ children, route }) => {
  Species.current = route.path;
  return children;
};

export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="upload" component={hub} >
        <IndexRoute component={GridView} />
        <Route path="map" component={MapView} />
        <Route path="stats" component={StatsView} />
      </Route>
      { Species.list.reduce((routes, { nickname }) =>
        routes.concat([
          <Route key={nickname} path={nickname} component={SpeciesSetter}>
            <IndexRoute component={SpeciesHome} />
            <Redirect from="upload" to="/upload" />
            <Route path="collection/:id" component={ExploreCollection} />
          </Route>,
        ]), []
      )}
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);
