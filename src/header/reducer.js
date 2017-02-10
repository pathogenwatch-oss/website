import { FETCH_COLLECTION, UPDATE_COLLECTION_PROGRESS, RESET_COLLECTION_VIEW }
  from '../collection-route/actions';
import { HEADER_TOGGLE_ASIDE, HEADER_TOGGLE_USER_DRAWER } from './actions';


import { getHeaderClassName } from '../collection-route';

const initialState = { hasAside: false };

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case HEADER_TOGGLE_ASIDE:
      return { ...state, hasAside: payload.isOpen };
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
        hasAside: false,
        userDrawerOpen: payload.isOpen,
      };
    default:
      return state;
  }
}
