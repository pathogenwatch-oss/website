const TOAST_SHOW = 'TOAST_SHOW';

export function showToast(toast) {
  return {
    type: TOAST_SHOW,
    payload: toast,
  };
}

const TOAST_HIDE = 'TOAST_HIDE';

export function hideToast() {
  return {
    type: TOAST_HIDE,
  };
}

export default from './Toast.react';
