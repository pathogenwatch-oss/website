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
    .then(registration => {
      let serviceWorker;
      if (registration.installing) {
        serviceWorker = registration.installing;
        console.log('sw installing');
      } else if (registration.waiting) {
        serviceWorker = registration.waiting;
        console.log('sw waiting');
      } else if (registration.active) {
        serviceWorker = registration.active;
        console.log('sw active');
      }
      if (serviceWorker) {
        const initialState = serviceWorker.state;
        console.log(serviceWorker.state);
        serviceWorker.addEventListener('statechange', e => {
          if (initialState === 'installing' && e.target.state === 'activated') {
            store.dispatch({
              type: 'TOAST_SHOW',
              payload: {
                message: 'Refresh to complete offline installation.',
              },
            });
          }
        });
      }
    });
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
