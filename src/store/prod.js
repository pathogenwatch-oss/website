import { createStore, applyMiddleware } from 'redux';

export default function (middleware, rootReducer) {
  return applyMiddleware(...middleware)(createStore)(rootReducer);
}
