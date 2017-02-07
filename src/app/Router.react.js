import React from 'react';
import { Router, Route, browserHistory, Redirect, IndexRedirect } from 'react-router';

import App from './App.react';

import CollectionsRoute from '../collections';
import CollectionRoute from '../collection-route';
import { GenomesRoute, UploadRoute } from '../genomes';
import DocumentationViewerRoute from '../documentation-viewer';

import NotFound from '../components/NotFound.react';

import Species from '../species';

const SpeciesSetter = ({ children, route }) => {
  Species.current = route.path;
  return children;
};

export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="collections" />
      {CollectionsRoute}
      {GenomesRoute}
      {UploadRoute}
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
