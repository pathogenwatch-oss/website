import React from 'react';
import { Router, Route, browserHistory, Redirect, IndexRoute } from 'react-router';

import App from './App.react';

import Home from '../home';
import AccountRoute from '../account';
import CollectionsRoute from '../collections';
import GenomesRoute from '../genomes';
import CollectionViewerRoute from '../collection-viewer';
import DocumentationViewerRoute from '../documentation-viewer';

import NotFound from '../components/NotFound.react';

import Species from '../species';

export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      {AccountRoute}
      {CollectionsRoute}
      {GenomesRoute}
      { Species.list.map(({ nickname, name }) =>
          <Redirect key={nickname} from={nickname} to="/genomes" query={{ species: name }} />
      )}
      <Redirect from=":species/upload" to="/upload" />
      <Redirect from="upload" to="/genomes/upload" />
      <Redirect from=":species/collection/:id" to="/collection/:id" />
      {CollectionViewerRoute}
      {DocumentationViewerRoute}
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);
