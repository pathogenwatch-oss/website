import { requestFile } from '../utils/Api';

import Species from '^/species';


export const SET_MENU_ACTIVE = 'SET_MENU_ACTIVE';

export function setMenuActive(active) {
  return {
    type: SET_MENU_ACTIVE,
    active,
  };
}


export const REQUEST_DOWNLOAD = 'REQUEST_DOWNLOAD';

export function requestDownload({ format, collection, idList, filename }) {
  const idType = collection ? 'collection' : 'assembly';
  return {
    type: REQUEST_DOWNLOAD,
    format,
    idList,
    filename,
    promise: requestFile({ speciesId: Species.id, format, idType }, { idList }),
  };
}
