import { SET_MENU_ACTIVE } from '../actions/download';
import { BODY_CLICK } from '../actions/bodyClick';

const initialState = false;

const actions = {
  [SET_MENU_ACTIVE]: function (state, { active } = {}) {
    if (typeof active !== 'undefined') {
      return active;
    }
    return state;
  },
  [BODY_CLICK]: function (state) {
    if (state === true) {
      return false;
    }
    return state;
  },
};

export default { actions, initialState };
