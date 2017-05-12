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

import NotFound from '../components/NotFound.react';

export default () => (
  <Switch>
    {HomepageRoute}
    <Redirect from="/index.html" to="/" />
    {OrganismsRoute}
    {OrganismDetails}
    {OrganismRedirects}
    {AccountRoute}
    {CollectionsRoute}
    <Redirect from="/collections/*" to="/collections/all" />
    <Redirect exact from="/collections" to="/collections/all" />,
    {GenomesRoute}
    <Redirect from="/genomes/*" to="/genomes/all" />
    <Redirect exact from="/genomes" to="/genomes/all" />
    <Redirect from="/:organism/upload" to="/upload" />
    <Redirect from="/upload" to="/genomes/upload" />
    {CollectionViewerRoute}
    <Redirect from="/:organism/collection/:slug" to="/collection/:slug" />
    {DocumentationViewerRoute}
    {OfflineRoute}
    <Route component={NotFound} />
  </Switch>
);
