import { createStore, applyMiddleware, compose } from 'redux';

// import createLogger from 'redux-logger';

const configureStore = middleware => compose(
  // applyMiddleware(...middleware, createLogger()),
  applyMiddleware(...middleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

export default (middleware, rootReducer) =>
  function getStore() {
    const store = configureStore(middleware)(rootReducer);

    if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('../reducers', () => {
        const nextRootReducer = require('../reducers').default;
        store.replaceReducer(nextRootReducer);
      });
    }

    return store;
  };
