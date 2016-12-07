import { combineReducers } from 'redux';

import { SET_MENU_ACTIVE, REQUEST_DOWNLOAD } from './actions';

import * as utils from './utils';

function menuOpen(state = false, { type, payload }) {
  switch (type) {
    case SET_MENU_ACTIVE: {
      if (typeof payload.active !== 'undefined') {
        return payload.active;
      }
      return state;
    }
    default:
      return state;
  }
}

function updateDownloads(state, payload, newStateForKey) {
  const { format, id } = payload;

  const { linksById = {}, ...downloadState } = state[format];
  const downloadKey = utils.createDownloadKey(id);

  return {
    ...state,
    [format]: {
      ...downloadState,
      linksById: {
        ...linksById,
        [downloadKey]: newStateForKey,
      },
    },
  };
}

function files(state = utils.getInitialFileState(), { type, payload }) {
  switch (type) {
    case REQUEST_DOWNLOAD.ATTEMPT:
      return updateDownloads(state, payload, { loading: true });
    case REQUEST_DOWNLOAD.FAILURE:
      return updateDownloads(state, payload, { error: true });
    case REQUEST_DOWNLOAD.SUCCESS: {
      const { format, filename, result } = payload;
      const { createLink = utils.createDefaultLink } = state[format];

      const link = createLink(result, filename);
      return updateDownloads(state, payload, { link, filename });
    }
    default:
      return state;
  }
}

export default combineReducers({
  menuOpen,
  files,
});
