import { createStore, applyMiddleware, compose } from 'redux';

const configureStore = middleware => compose(
  applyMiddleware(...middleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

export default (middleware, rootReducer) =>
  configureStore(middleware)(rootReducer);
