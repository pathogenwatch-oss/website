import { REQUEST_DOWNLOAD } from './actions';

import { statuses } from './constants';

function updateDownloads(state, payload, nextState) {
  const { format, stateKey } = payload;
  const formatState = state[format] || {};

  return {
    ...state,
    [format]: {
      ...formatState,
      [stateKey]: nextState,
    },
  };
}

export default function (state = {}, { type, payload }) {
  switch (type) {
    case REQUEST_DOWNLOAD.ATTEMPT:
      return updateDownloads(state, payload, { status: statuses.LOADING });
    case REQUEST_DOWNLOAD.FAILURE:
      return updateDownloads(state, payload, { status: statuses.ERROR });
    case REQUEST_DOWNLOAD.SUCCESS:
      return updateDownloads(state, payload, { status: statuses.SUCCESS, result: payload.result });
    default:
      return state;
  }
}
