import { combineReducers } from 'redux';

import queue from './queue';
import entities from './entities';
import status from './status';
import errors from './errors';

export default combineReducers({
  entities,
  errors,
  queue,
  status,
});
