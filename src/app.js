import React from 'react';
import Router, { Route, RouteHandler, Redirect, NotFoundRoute } from 'react-router';

import UploadCollectionPage from './components/collection/UploadCollectionPage.react';
import Collection from './components/Collection.react';
import NotFound from './components/NotFound.react';

class Application extends React.Component {
  render() {
    return <RouteHandler params={this.props.params} />;
  }
}

const routes = (
  <Route name="application" path="/" handler={Application}>
    <Redirect from="/" to="/collection" />
    <Route name="collection" path="/collection/?" handler={UploadCollectionPage} />
    <Route name="collectionExplorer" path="/collection/:id/?" handler={Collection} />
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  React.render(<Handler params={state.params} />, document.body);
});
