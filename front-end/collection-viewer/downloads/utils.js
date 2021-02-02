import { getServerPath } from '~/utils/Api';
import Organisms from '~/organisms';

export const encode = encodeURIComponent;
export const downloadPath = getServerPath('/download/file');

export function createDownloadKey(id) {
  if (!id) return null;
  return typeof id === 'string' ? id : JSON.stringify(id);
}

export function formatCollectionFilename(collection, suffix = '') {
  if (collection.isClusterView) {
    return `pathogenwatch-${suffix}`;
  }
  return [ 'pathogenwatch', Organisms.nickname, collection.uuid, suffix ].join('-');
}
