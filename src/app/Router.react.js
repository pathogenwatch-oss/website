import React from 'react';
import { Router, Route, browserHistory, Redirect, IndexRedirect } from 'react-router';

import App from './App.react';

import { SpeciesRoute } from '../species';
import AccountRoute from '../account';
import CollectionsRoute from '../collections';
import GenomesRoute from '../genomes';
import CollectionViewerRoute from '../collection-viewer';
import DocumentationViewerRoute from '../documentation-viewer';

import NotFound from '../components/NotFound.react';

export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="species" />
      <Redirect from="index.html" to="/" />
      {SpeciesRoute}
      {AccountRoute}
      {CollectionsRoute}
      {GenomesRoute}
      <Redirect from=":species/upload" to="/upload" />
      <Redirect from="upload" to="/genomes/upload" />
      <Redirect from=":species/collection/:id" to="/collection/:id" />
      {CollectionViewerRoute}
      {DocumentationViewerRoute}
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);
