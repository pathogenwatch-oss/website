import { CHANGE_BRANDING } from './actions';

import { brandings } from './constants';

function getInitalBranding() {
  return brandings[1];
  // return brandings[Math.floor(Math.random() * 3)];
}

const initialState = {
  id: getInitalBranding(),
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CHANGE_BRANDING:
      return {
        id: action.payload,
      };
    default:
      return state;
  }
}
