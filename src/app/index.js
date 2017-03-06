import '../css/base.css';
import '../css/cgps-mdl-theme.css';
import './utils.css';
import 'phylocanvas/polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Router from './Router.react';

import store from './store';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(console.log);
}

function renderApp(Root) {
  render((
    <Provider store={store}>
      <Root />
    </Provider>
  ), document.getElementById('wgsa'));
}

renderApp(Router);

// if (module.hot) {
//   module.hot.accept('./Router.react', () => {
//     const NextRouter = require('./Router.react').default;
//     renderApp(NextRouter);
//   });
// }
