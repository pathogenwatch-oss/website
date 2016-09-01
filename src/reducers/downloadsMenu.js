import { SET_MENU_ACTIVE } from '../actions/downloads';
import { BODY_CLICK } from '../actions/bodyClick';

const initialState = false;

const actions = {
  [SET_MENU_ACTIVE](state, { active } = {}) {
    if (typeof active !== 'undefined') {
      return active;
    }
    return state;
  },
  [BODY_CLICK](state) {
    if (state === true) {
      return false;
    }
    return state;
  },
};

export default { actions, initialState };
