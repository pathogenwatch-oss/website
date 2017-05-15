import {
  HEADER_TOGGLE_ASIDE,
  HEADER_TOGGLE_USER_DRAWER,
} from './actions';

const initialState = {
  asideVisible: false,
  userDrawerVisible: false,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case HEADER_TOGGLE_ASIDE:
      return {
        ...state,
        userDrawerVisible: false,
        asideVisible: payload.isOpen,
      };
    case HEADER_TOGGLE_USER_DRAWER:
      return {
        ...state,
        asideVisible: false,
        userDrawerVisible: payload.isOpen,
      };
    default:
      return state;
  }
}
