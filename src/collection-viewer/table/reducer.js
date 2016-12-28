import { combineReducers } from 'redux';

import metadata from '../../reducers/metadata';
import resistanceProfile from '../../reducers/resistanceProfile';

import { SET_TABLE } from './actions';

import { tableKeys } from './constants';

function visible(state = tableKeys.metadata, { type, payload }) {
  switch (type) {
    case SET_TABLE:
      return payload.name;
    default:
      return state;
  }
}

export default combineReducers({
  entities: combineReducers({
    metadata,
    resistanceProfile,
  }),
  visible,
});
