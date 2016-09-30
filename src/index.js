import './css/base.css';
import './css/cgps-mdl-theme.css';
import 'phylocanvas/polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import Router from './Router';

import store from '^/store';

function renderApp(Root) {
  render((
    <AppContainer>
      <Provider store={store}>
        <Root />
      </Provider>
    </AppContainer>
  ), document.getElementById('wgsa'));
}

renderApp(Router);

if (module.hot) {
  module.hot.accept('./Router', () => {
    const NextRouter = require('./Router').default;
    renderApp(NextRouter);
  });
}
