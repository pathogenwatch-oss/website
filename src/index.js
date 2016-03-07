import './css/cgps-mdl-theme.css';
import 'phylocanvas/polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Router from './Router';

import getStore from '^/store';

export const store = getStore();

function addDevTools() {
  if (process.env.NODE_ENV !== 'production') {
    const DevTools = require('^/DevTools').default;
    return (
      <DevTools />
    );
  }
}

render((
  <Provider store={store}>
    <div>
      <Router />
      { addDevTools() }
    </div>
  </Provider>
), document.getElementById('wgsa'));
