const TOAST_SHOW = 'TOAST_SHOW';

export function showToast(message, action) {
  return {
    type: TOAST_SHOW,
    payload: {
      message,
      action,
    },
  };
}

const TOAST_HIDE = 'TOAST_HIDE';

export function hideToast() {
  return {
    type: TOAST_HIDE,
  };
}

const initialState = {
  visible: false,
  message: null,
  action: null,
};

export function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case TOAST_SHOW:
      return {
        visible: true,
        ...payload,
      };
    case TOAST_HIDE:
      return initialState;
    default:
      return state;
  }
}

export default from './Toast.react';
