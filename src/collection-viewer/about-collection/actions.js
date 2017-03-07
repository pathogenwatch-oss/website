import { createAsyncConstants } from '../../actions';

export const TOGGLE_ABOUT_COLLECTION = 'TOGGLE_ABOUT_COLLECTION';

export function toggleAboutCollection(isOpen) {
  return {
    type: TOGGLE_ABOUT_COLLECTION,
    payload: {
      isOpen,
    },
  };
}

export const SAVE_FOR_OFFLINE = createAsyncConstants('SAVE_FOR_OFFLINE');

export function saveForOffline() {
  return (dispatch, getState) => {
    const state = getState();
    dispatch({
      type: SAVE_FOR_OFFLINE,
      payload: {
        promise: Promise.resolve(),
      },
    });
  };
}
