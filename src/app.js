import './css/cgps-mdl-theme.css';
import 'PhyloCanvas/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import Router, { Route, RouteHandler, DefaultRoute, NotFoundRoute, Redirect } from 'react-router';

import Home from './components/Home.react';
import UploadCollection from './components/collection/UploadWorkspace.react';
import ExploreCollection from './components/Collection.react';
import Toast from './components/Toast.react';
import NotFound from './components/NotFound.react';

import Species from './species';

const Application = () => (
  <div>
    <RouteHandler />
    <Toast />
  </div>
);

const routes = (
  <Route name="application" path="/" handler={Application}>
    <DefaultRoute handler={Home}/>
    { Species.list.map(({ nickname }) => [
      <Redirect from={`${nickname}/?`} to={`upload-${nickname}`} />,
      <Route
        name={`upload-${nickname}`}
        path={`${nickname}/upload/?`}
        handler={UploadCollection} />,
      <Route
        name={`collection-${nickname}`}
        path={`${nickname}/collection/:id/?`}
        handler={ExploreCollection}
      />,
    ]).reduce((all, speciesRoutes) => {
      return all.concat(speciesRoutes);
    }, [])
    }
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

const rootElement = document.getElementById('wgsa');

Router.run(routes, Router.HistoryLocation, function (Handler) {
  ReactDOM.render(<Handler />, rootElement);
});
