import '../css/base.css';
import '../css/cgps-mdl-theme.css';
import './utils.css';
import 'phylocanvas/polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from './App.react';

import store from './store';

render((
  <Provider store={store}>
    <Router>
      <Route component={App} />
    </Router>
  </Provider>
), document.getElementById('wgsa'));
