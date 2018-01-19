import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import HomepageRoute from '../homepage';
import OrganismsRoute, { OrganismDetails, OrganismRedirects } from '../organisms/route';
import AccountRoute from '../account';
import CollectionsRoute from '../collections';
import GenomesRoute from '../genomes';
import CollectionViewerRoute from '../collection-viewer';
import DocumentationViewerRoute from '../documentation-viewer';
import OfflineRoute from '../offline';
import UploadRoute from '../upload';

import NotFound from '../components/NotFound.react';

const RedirectWithQuery = ({ from, to }) => (
  <Route exact path={from}
    render={({ location }) => <Redirect to={`${to}${location.search}`} />}
  />
);

const getCollectionRedirect = () => (
  <Route exact path="/:organism/collection/:token"
    render={({ match }) =>
      <Redirect to={{
        pathname: `/collection/${match.params.token}`,
        state: { organism: match.params.organism },
      }}
      /> }
  />
);

export default () => (
  <Switch>
    {HomepageRoute}
    {OrganismsRoute}
    {OrganismDetails}
    {AccountRoute}
    {CollectionsRoute}
    {GenomesRoute}
    {CollectionViewerRoute}
    {DocumentationViewerRoute}
    {OfflineRoute}
    {UploadRoute}
    <Redirect from="/index.html" to="/" />
    <Redirect from="/collections/*" to="/collections/all" />
    <RedirectWithQuery from="/collections" to="/collections/all" />,
    <Redirect from="/genomes/*" to="/genomes/all" />
    <RedirectWithQuery from="/genomes" to="/genomes/all" />
    <Redirect from="/:organism/upload" to="/upload" />
    {OrganismRedirects}
    {getCollectionRedirect()}
    <Route path="/" component={NotFound} />
  </Switch>
);
