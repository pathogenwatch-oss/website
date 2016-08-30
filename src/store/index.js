import thunk from 'redux-thunk';

import { promiseToThunk } from '../middleware';
import rootReducer from '../reducers';

const middleware = [ promiseToThunk, thunk ];

const configureStoreCreator =
  process.env.NODE_ENV === 'production' ?
    require('./prod').default :
    require('./dev').default;

module.exports = configureStoreCreator(middleware, rootReducer);
