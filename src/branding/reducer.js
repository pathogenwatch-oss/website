import { CHANGE_BRANDING } from './actions';

import { brandings } from './constants';

const initialState = {
  id: brandings[0],
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
