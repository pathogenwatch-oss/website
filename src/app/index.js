import '../css/base.css';
import '../css/cgps-mdl-theme.css';
import './utils.css';
import 'phylocanvas/polyfill';

import React from 'react';
import Provider from 'react-redux/lib/components/Provider';

import Router from './router';
import store from './store';

import { applyTheme } from '@cgps/libmicroreact/theme';
import pathogenwatchTheme from '@cgps/libmicroreact/theme/pathogenwatch';

applyTheme(pathogenwatchTheme);

const App = () => (
  <Provider store={store}>
    <Router />
  </Provider>
);

export default App;

