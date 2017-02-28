import { FETCH_COLLECTION, UPDATE_COLLECTION_PROGRESS, RESET_COLLECTION_VIEW }
  from '../collection-viewer/actions';
import {
  HEADER_TOGGLE_ASIDE,
  HEADER_TOGGLE_USER_DRAWER,
  HEADER_TOGGLE_ASIDE_DISABLED,
} from './actions';


import { getHeaderClassName } from '../collection-viewer';

const initialState = {
  asideVisible: false,
  asideDisabled: false,
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
    case FETCH_COLLECTION.SUCCESS:
    case UPDATE_COLLECTION_PROGRESS:
      return {
        ...state,
        className: getHeaderClassName((payload.result || payload.progress).status),
      };
    case RESET_COLLECTION_VIEW:
      return {
        ...state,
        className: null,
      };
    case HEADER_TOGGLE_USER_DRAWER:
      return {
        ...state,
        asideVisible: false,
        userDrawerVisible: payload.isOpen,
      };
    case HEADER_TOGGLE_ASIDE_DISABLED:
      return {
        ...state,
        asideVisible: false,
        asideDisabled: payload.isDisabled,
      };
    default:
      return state;
  }
}
