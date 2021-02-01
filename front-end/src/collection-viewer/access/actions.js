import { createAsyncConstants } from '../../actions';
import { getCollection } from '../selectors';

import { fetchJson } from '../../utils/Api';

export const COLLECTION_CHANGE_ACCESS_LEVEL =
  createAsyncConstants('COLLECTION_CHANGE_ACCESS_LEVEL');

export function changeAccessLevel(access) {
  return (dispatch, getState) => {
    const state = getState();
    const { token } = getCollection(state);
    dispatch({
      type: COLLECTION_CHANGE_ACCESS_LEVEL,
      payload: {
        promise: fetchJson('POST', `/api/collection/${token}/access`, { access }),
        access,
      },
    });
  };
}
