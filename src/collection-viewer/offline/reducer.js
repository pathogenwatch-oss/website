import { statuses } from './constants';

import { SET_OFFLINE_STATUS } from './actions';

const initialState = {
  status: statuses.UNSAVED,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case SET_OFFLINE_STATUS:
      return {
        status: payload.status,
      };
    default:
      return state;
  }
}
