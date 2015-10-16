import './css/cgps-mdl-theme.css';
import 'PhyloCanvas/polyfill';

import React from 'react';
import Router, { Route, RouteHandler, DefaultRoute, NotFoundRoute, Redirect } from 'react-router';

import Home from './components/Home.react';
import UploadCollection from './components/collection/UploadWorkspace.react';
import ExploreCollection from './components/Collection.react';
import Toast from './components/Toast.react';
import NotFound from './components/NotFound.react';

import Species from './species';

class Application extends React.Component {
  render() {
    return (
      <div>
        <RouteHandler />
        <Toast />
      </div>
    );
  }
}

const routes = (
  <Route name="application" path="/" handler={Application}>
    <DefaultRoute handler={Home}/>
    <Redirect from=":species/?" to="upload" />
    <Route name="upload" path=":species/upload/?" handler={UploadCollection} />
    <Route name="collection" path=":species/collection/:id/?" handler={ExploreCollection} />
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

const rootElement = document.getElementById('wgsa');

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  const requestedSpecies = state.params.species;
  if (!requestedSpecies) {
    return React.render(<Handler />, rootElement);
  }

  if (Species.isSupported(requestedSpecies)) {
    Species.current = requestedSpecies;
    React.render(<Handler />, rootElement);
  } else {
    React.render(<NotFound />, rootElement);
  }
});
