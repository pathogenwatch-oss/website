import { createAsyncConstants } from '../../actions';

import { makeFileRequest } from '../../utils/Api';

export const SET_MENU_ACTIVE = 'SET_MENU_ACTIVE';

export function setMenuActive(active) {
  return {
    type: SET_MENU_ACTIVE,
    payload: {
      active,
    },
  };
}

export const REQUEST_DOWNLOAD = createAsyncConstants('REQUEST_DOWNLOAD_OLD');

export function requestDownload(args) {
  const {
    format, id, filename, organismId,
    getFileContents = makeFileRequest(format, id, organismId),
  } = args;

  return {
    type: REQUEST_DOWNLOAD,
    payload: {
      format,
      id,
      filename,
      promise: getFileContents(),
    },
  };
}
