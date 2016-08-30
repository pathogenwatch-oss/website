import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';

import { readyStatePromise } from '../middleware';
import rootReducer from '../reducers';

const configureStore = compose(
  applyMiddleware(readyStatePromise, createLogger()),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

export default function getStore() {
  const store = configureStore(rootReducer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
