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
    default:
      return state;
  }
}

export function selector({ header }) {
  return header;
}
