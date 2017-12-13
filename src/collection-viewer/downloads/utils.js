import { getServerPath } from '../../utils/Api';
import Organisms from '../../organisms';

export const encode = encodeURIComponent;
export const downloadPath = getServerPath('/download/file');

export function createDownloadKey(id) {
  if (!id) return null;
  return typeof id === 'string' ? id : JSON.stringify(id);
}

export function formatCollectionFilename({ uuid }, suffix = '') {
  return [ 'wgsa', Organisms.nickname, uuid, suffix ].join('-');
}
