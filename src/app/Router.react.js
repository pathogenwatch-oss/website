import React from 'react';
import { Router, Route, IndexRoute, browserHistory, Redirect } from 'react-router';

import App from './App.react';
import Home from '../home';
import hub, { GridView, MapView, StatsView } from '../hub';

import CollectionViewerRoute from '../collection-viewer';

import NotFound from '../components/NotFound.react';

import Species from '../species';

const SpeciesSetter = ({ children, route }) => {
  Species.current = route.path;
  return children;
};

export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="upload" component={hub}>
        <IndexRoute component={GridView} />
        <Route path="map" component={MapView} />
        <Route path="stats" component={StatsView} />
      </Route>
      { Species.list.map(({ nickname }) =>
          <Route key={nickname} path={nickname} component={SpeciesSetter}>
            <Redirect from="/" to={`/?species=${nickname}`} />
            <Redirect from="upload" to="/upload" />
            {CollectionViewerRoute}
          </Route>
      )}
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);
