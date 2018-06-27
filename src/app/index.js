import '../css/base.css';
import '../css/cgps-mdl-theme.css';
import './utils.css';
import 'phylocanvas/polyfill';

import React from 'react';
import { render } from 'react-dom';
import Provider from 'react-redux/lib/components/Provider';
import { AppContainer } from 'react-hot-loader';

import Router from './router';
import store from './store';

const renderApp = () => render(
  <AppContainer>
    <Provider store={store}>
      <Router />
    </Provider>
  </AppContainer>,
  document.getElementById('pathogenwatch')
);

if (module.hot) {
  module.hot.accept('./router', renderApp);
}

renderApp();
