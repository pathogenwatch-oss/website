import './css/base.css';
import './css/cgps-mdl-theme.css';
import 'phylocanvas/polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Router from './Router';

import store from '^/store';

function renderApp(Root) {
  render((
    <Provider store={store}>
      <Root />
    </Provider>
  ), document.getElementById('wgsa'));
}

renderApp(Router);

if (module.hot) {
  module.hot.accept('./Router', () => {
    const NextRouter = require('./Router').default;
    renderApp(NextRouter);
  });
}
