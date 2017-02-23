import React from 'react';
import { Router, Route, browserHistory, Redirect, IndexRedirect } from 'react-router';

import App from './App.react';

import AccountRoute from '../account';
import CollectionsRoute from '../collections';
import CollectionRoute from '../collection-viewer';
import GenomesRoute from '../genomes';
import DocumentationViewerRoute from '../documentation-viewer';

import NotFound from '../components/NotFound.react';

import Species from '../species';

export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="collections" />
      {AccountRoute}
      {CollectionsRoute}
      {GenomesRoute}
      { Species.list.map(({ nickname, name }) =>
          <Redirect key={nickname} from={nickname} to="/genomes" query={{ species: name }} />
      )}
      <Redirect from=":species/upload" to="/upload" />
      <Redirect from="upload" to="/genomes/upload" />
      <Redirect from=":species/collection/:id" to="/collection/:id" />
      {CollectionRoute}
      {DocumentationViewerRoute}
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);
