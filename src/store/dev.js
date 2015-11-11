import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';

import { readyStatePromise } from '../middleware';
import DevTools from '../DevTools';
import rootReducer from '../reducers';

const configureStore = compose(
  applyMiddleware(readyStatePromise, createLogger()),
  DevTools.instrument()
)(createStore);

export default function getStore() {
  const store = configureStore(rootReducer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
