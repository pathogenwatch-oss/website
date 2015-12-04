import './css/cgps-mdl-theme.css';
import 'phylocanvas/polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Redirect } from 'react-router';
import { createHistory } from 'history';

import Home from './components/Home.react';
import UploadCollection from './components/upload';
import ExploreCollection from './components/explorer';
import Toast from './components/Toast.react';
import NotFound from './components/NotFound.react';

import Species from './species.js';

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
  <Router history={createHistory()}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      { Species.list.reduce((routes, { nickname }) =>
        routes.concat([
          <Redirect key={`${nickname}-redirect`} from={nickname} to={`${nickname}/upload`} />,
          <Route key={nickname} path={nickname} component={SpeciesSetter}>
            <Route path="upload" component={UploadCollection} />
            <Route path="collection/:id" component={ExploreCollection} />
          </Route>,
        ]), []
      )}
    </Route>
    <Route path="*" component={NotFound}/>
  </Router>
), document.getElementById('wgsa'));
