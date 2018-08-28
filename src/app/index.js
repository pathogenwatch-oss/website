import '../css/base.css';
import '../css/cgps-mdl-theme.css';
import './utils.css';
import 'phylocanvas/polyfill';

import React from 'react';
import Provider from 'react-redux/lib/components/Provider';

import Router from './router';
import store from './store';

const App = () => (
  <Provider store={store}>
    <Router />
  </Provider>
);

export default App;

