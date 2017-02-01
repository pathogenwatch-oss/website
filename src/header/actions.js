export const HEADER_TOGGLE_ASIDE = 'HEADER_TOGGLE_ASIDE';

export function toggleAside(isOpen) {
  return {
    type: HEADER_TOGGLE_ASIDE,
    payload: {
      isOpen,
    },
  };
}

export const HEADER_TOGGLE_USER_DRAWER = 'HEADER_TOGGLE_USER_DRAWER';

export function toggleUserDrawer(isOpen) {
  return {
    type: HEADER_TOGGLE_USER_DRAWER,
    payload: {
      isOpen,
    },
  };
}
