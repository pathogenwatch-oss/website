import { createStore, applyMiddleware } from 'redux';

import { readyStatePromise } from './middleware';
import rootReducer from './reducers';

export default applyMiddleware(
  readyStatePromise
)(createStore)(rootReducer);
