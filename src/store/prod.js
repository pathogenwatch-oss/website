import { createStore, applyMiddleware } from 'redux';

export default (middleware, rootReducer) =>
  () => applyMiddleware(...middleware)(createStore)(rootReducer);
