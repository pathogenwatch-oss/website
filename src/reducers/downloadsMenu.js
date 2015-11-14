import { SET_MENU_ACTIVE } from '../actions/download';

const initialState = { active: false };

const actions = {
  [SET_MENU_ACTIVE]: function (state, { active } = {}) {
    if (typeof active !== 'undefined') {
      return { active };
    }
    return state;
  },
};

export default { actions, initialState };
