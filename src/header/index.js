import { FETCH_COLLECTION, UPDATE_COLLECTION_PROGRESS, RESET_COLLECTION_VIEW }
  from '../collection-route/actions';

import { getHeaderClassName } from '../collection-route';

const HEADER_TOGGLE_ASIDE = 'HEADER_TOGGLE_ASIDE';

export function toggleAside(isOpen) {
  return {
    type: HEADER_TOGGLE_ASIDE,
    payload: {
      isOpen,
    },
  };
}

const initialState = { hasAside: false };

export function reducer(state = initialState, { type, payload }) {
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
    default:
      return state;
  }
}

export function selector({ header }) {
  return header;
}

export default from './Header.react';
