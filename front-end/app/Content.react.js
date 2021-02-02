import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import AccountRoute from '../account';
import CollectionViewerRoute from '../collection-viewer';
import ClusterViewerRoute from '../cluster-viewer';
import CollectionsRoute from '../collections';
import GenomesRoute from '../genomes';
import HomepageRoute from '../homepage';
import OfflineRoute from '../offline';
import OrganismsRoute, { OrganismDetails, OrganismRedirects } from '../organisms/route';
import SignInRoute from '../sign-in';
import UploadRoute from '../upload';

import NotFound from '../components/NotFound.react';

const RedirectWithQuery = ({ from, to }) => (
  <Route exact path={from}
    render={({ location }) => <Redirect to={`${to}${location.search}`} />}
  />
);

const getCollectionRedirect = () => (
  <Route exact path="/:organism/collection/:token"
    render={({ match }) => {
      const route = {
        pathname: `/collection/${match.params.token}`,
        state: { organism: match.params.organism },
      };
      return (
        <Redirect to={route} />
      );
    }}
  />
);

const RedirectExternal = ({ from, to }) => (
  <Route exact path={from}
    render={() => {
      if (window && window.location) {
        window.location = to;
      }
    }}
  />
);

export default () => (
  <Switch>
    {AccountRoute}
    {CollectionViewerRoute}
    {ClusterViewerRoute}
    {CollectionsRoute}
    {GenomesRoute}
    {HomepageRoute}
    {OfflineRoute}
    {OrganismDetails}
    {OrganismsRoute}
    {SignInRoute}
    {UploadRoute}
    <RedirectExternal from="/documentation" to="https://cgps.gitbook.io/pathogenwatch/" />
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
