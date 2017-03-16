import { SERVER_ADDRESS } from '../utils/Api';
import Organisms from '../organisms';

export const encode = encodeURIComponent;
export const downloadPath = `${SERVER_ADDRESS}/download/file`;

export function formatCollectionFilename({ uuid }) {
  return [ Organisms.nickname, uuid ].join('_');
}

export function createGenomeArchiveLink(result, filename) {
  if (!result) return null;
  return `${SERVER_ADDRESS}/download/genome-archive/${result.fileId}?filename=${filename}`;
}
