import { CHECK_STATUS, UPDATE_PROGRESS } from '../actions/fetch';

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
    case CHECK_STATUS.SUCCESS:
    case UPDATE_PROGRESS:
      return {
        ...state,
        className: getHeaderClassName(payload.result.status),
      };
    default:
      return state;
  }
}

export function selector({ header }) {
  return header;
}

export default from './Header.react';
