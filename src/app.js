import 'material-design-lite/material.min.css';

import React from 'react';
import Router, { Route, RouteHandler, NotFoundRoute } from 'react-router';

import UploadCollection from './components/collection/UploadCollectionPage.react';
import ExploreCollection from './components/Collection.react';
import NotFound from './components/NotFound.react';

import speciesData from './species';

class Application extends React.Component {
  render() {
    return <RouteHandler />;
  }
}

const routes = (
  <Route name="application" path="/" handler={Application}>
    <Route name="upload" path=":species/upload/?" handler={UploadCollection} />
    <Route name="collection" path=":species/collection/:id/?" handler={ExploreCollection} />
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  const speciesDef = speciesData[state.params.species];
  if (speciesDef) {
    React.render(<Handler species={speciesDef}/>, document.body);
  } else {
    React.render(<NotFound />, document.body);
  }
});
