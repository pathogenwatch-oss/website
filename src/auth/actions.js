import { createAsyncConstants } from '../actions';
import * as api from './api';

export const GET_AUTH_TOKEN = createAsyncConstants('GET_AUTH_TOKEN');

export function getAuthToken() {
  return {
    type: GET_AUTH_TOKEN,
    payload: {
      promise: api.getToken(),
    },
  };
}
