import React from 'react';

import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './App';
import Home from './components/Home.react';
import SpeciesHome from './components/SpeciesHome.react';
import UploadCollection from './components/upload';
import ExploreCollection from './components/explorer';
import NotFound from './components/NotFound.react';

import Species from './species';

const SpeciesSetter = ({ route, children }) => {
  Species.current = route.path;
  return children;
};

export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      { Species.list.filter(_ => _.active).reduce((routes, { nickname }) =>
        routes.concat([
          <Route key={nickname} path={nickname} component={SpeciesSetter}>
            <IndexRoute component={SpeciesHome} />
            <Route path="upload" component={UploadCollection} />
            <Route path="collection/:id" component={ExploreCollection} />
          </Route>,
        ]), []
      )}
    </Route>
    <Route path="*" component={NotFound}/>
  </Router>
);
