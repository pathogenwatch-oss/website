import { combineReducers } from 'redux';

import { SET_MENU_ACTIVE } from './actions';

function menuOpen(state = false, { type, payload }) {
  switch (type) {
    case SET_MENU_ACTIVE: {
      if (typeof payload.active !== 'undefined') {
        return payload.active;
      }
      return state;
    }
    default:
      return state;
  }
}

export default combineReducers({
  menuOpen,
});
