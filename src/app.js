import React from 'react';
import Router, { Route, RouteHandler, DefaultRoute, NotFoundRoute, Redirect } from 'react-router';

import Home from './components/Home.react';
import UploadCollection from './components/collection/UploadCollectionPage.react';
import ExploreCollection from './components/Collection.react';
import NotFound from './components/NotFound.react';

import Species from './species';

class Application extends React.Component {
  render() {
    return <RouteHandler />;
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

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  const requestedSpecies = state.params.species;
  if (!requestedSpecies) {
    return React.render(<Handler />, document.body);
  }

  if (Species.isSupported(requestedSpecies)) {
    Species.current = requestedSpecies;
    React.render(<Handler />, document.body);
  } else {
    React.render(<NotFound />, document.body);
  }
});
