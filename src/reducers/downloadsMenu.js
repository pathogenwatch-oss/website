import { SET_MENU_ACTIVE } from '../actions/download';

const initialState = { active: false };

const actions = {
  [SET_MENU_ACTIVE]: function (state, active) {
    if (typeof active === 'undefined') {
      return state;
    }

    return { active };
  },
};

export default { actions, initialState };
