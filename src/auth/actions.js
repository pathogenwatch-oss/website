import * as api from './api';

export const GET_AUTH_TOKEN = 'GET_AUTH_TOKEN';

export function getAuthToken() {
  return (dispatch, getState) => {
    const state = getState();
    return dispatch({
      type: GET_AUTH_TOKEN,
      payload: {
        promise: state.auth.token
          ? Promise.resolve(state.auth.token)
          : api.getToken(),
      },
    });
  };
}
