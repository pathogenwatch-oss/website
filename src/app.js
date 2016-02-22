import './css/cgps-mdl-theme.css';
import 'phylocanvas/polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Home from './components/Home.react';
import SpeciesHome from './components/SpeciesHome.react';
import UploadCollection from './components/upload';
import ExploreCollection from './components/explorer';
import Toast from './components/Toast.react';
import NotFound from './components/NotFound.react';

import Species from './species';

const App = ({ children }) => (
  <div>
    {children}
    <Toast />
  </div>
);

const SpeciesSetter = ({ route, children }) => {
  Species.current = route.path;
  return children;
};

render((
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
), document.getElementById('wgsa'));
