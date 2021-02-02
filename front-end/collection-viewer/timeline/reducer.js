import { combineReducers } from 'redux';
import reducer from '@cgps/libmicroreact/timeline/reducer';

import { CLEAR_FILTERS } from '../filter/actions';
import { SHOW_TIMELINE } from './actions';
import { SET_TABLE } from '../table/actions';

const libmicroreact = function (state, action = {}) {
  switch (action.type) {
    case CLEAR_FILTERS:
      return {
        ...state,
        bounds: null,
      };
    default:
      return reducer(state, action);
  }
};

const visible = function (state = null, action = {}) {
  switch (action.type) {
    case SHOW_TIMELINE:
      return true;
    case SET_TABLE:
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  libmicroreact,
  visible,
});
