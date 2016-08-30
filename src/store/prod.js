import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { readyStatePromise } from '../middleware';
import rootReducer from '../reducers';

export default function () {
  return applyMiddleware(readyStatePromise, thunk)(createStore)(rootReducer);
}
