export const TOGGLE_ABOUT_COLLECTION = 'TOGGLE_ABOUT_COLLECTION';

export function toggleAboutCollection(isOpen) {
  return {
    type: TOGGLE_ABOUT_COLLECTION,
    payload: {
      isOpen,
    },
  };
}
