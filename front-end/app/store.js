import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { promiseToThunk } from '../middleware';
import rootReducer from './reducer';

const middleware = [ promiseToThunk, thunk ];

const store = compose(
  applyMiddleware(...middleware),
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
)(createStore)(rootReducer);

export default store;

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducer', () => {
    store.replaceReducer(rootReducer);
  });
}
