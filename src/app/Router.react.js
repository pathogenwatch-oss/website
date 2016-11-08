import React from 'react';
import { Router, Route, IndexRoute, browserHistory, Redirect, IndexRedirect } from 'react-router';

import App from './App.react';

import HomeRoute from '../home';
import CollectionRoute from '../collection-route';
import DocumentationViewerRoute from '../documentation-viewer';

import hub, { GridView, MapView, StatsView } from '../hub';
import NotFound from '../components/NotFound.react';

import Species from '../species';

const SpeciesSetter = ({ children, route }) => {
  Species.current = route.path;
  return children;
};

export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      {HomeRoute}
      <Route path="upload" component={hub}>
        <IndexRoute component={GridView} />
        <Route path="map" component={MapView} />
        <Route path="stats" component={StatsView} />
      </Route>
      { Species.list.map(({ nickname }) =>
          <Route key={nickname} path={nickname} component={SpeciesSetter}>
            <IndexRedirect to="/" query={{ species: nickname }} />
            <Redirect from="upload" to="/upload" />
            {CollectionRoute}
          </Route>
      )}
      {DocumentationViewerRoute}
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);
