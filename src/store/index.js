import thunk from 'redux-thunk';

import { promiseToThunk } from '../middleware';
import rootReducer from '../reducers';

const middleware = [ promiseToThunk, thunk ];

const getStore =
  process.env.NODE_ENV === 'production' ?
    require('./prod').default :
    require('./dev').default;

const store = getStore(middleware, rootReducer);

export default store;

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('../reducers', () => {
    const nextRootReducer = require('../reducers').default;
    store.replaceReducer(nextRootReducer);
  });
}
