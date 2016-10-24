import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { promiseToThunk } from '../middleware';
import rootReducer from '../reducers';

const middleware = [ promiseToThunk, thunk ];

const isDev = process.env.NODE_ENV !== 'production';

const store = compose(
  applyMiddleware(...middleware),
  isDev && window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)(rootReducer);

export default store;

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('../reducers', () => {
    const nextRootReducer = require('../reducers').default;
    store.replaceReducer(nextRootReducer);
  });
}
