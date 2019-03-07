export const UPLOAD_ERROR_MESSAGE = 'UPLOAD_ERROR_MESSAGE';

export function uploadErrorMessage(message) {
  return {
    type: UPLOAD_ERROR_MESSAGE,
    payload: message,
  };
}
