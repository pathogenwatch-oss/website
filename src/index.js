import './css/base.css';
import './css/cgps-mdl-theme.css';
import 'phylocanvas/polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Router from './Router';

import getStore from '^/store';

export const store = getStore();

render((
  <Provider store={store}>
    <Router />
  </Provider>
), document.getElementById('wgsa'));
