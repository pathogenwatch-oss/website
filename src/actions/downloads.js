import { createAsyncConstants } from '../actions';

import { makeFileRequest } from '../utils/Api';

export const SET_MENU_ACTIVE = 'SET_MENU_ACTIVE';

export function setMenuActive(active) {
  return {
    type: SET_MENU_ACTIVE,
    active,
  };
}


export const REQUEST_DOWNLOAD = createAsyncConstants('REQUEST_DOWNLOAD');

export function requestDownload(args) {
  const {
    format, idList, filename, speciesId,
    getFileContents = makeFileRequest(format, idList, speciesId),
  } = args;

  return {
    type: REQUEST_DOWNLOAD,
    payload: {
      format,
      idList,
      filename,
      promise: getFileContents(),
    },
  };
}
