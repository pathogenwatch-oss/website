import { requestDownload } from './actions';
import { showToast } from '../../toast';

import { fileTypes } from './constants';

import { getServerPath } from '../../utils/Api';
import Organisms from '../../organisms';

export const encode = encodeURIComponent;
export const downloadPath = getServerPath('/download/file');

export function getInitialFileState() {
  return fileTypes;
}

export function createDownloadKey(id) {
  if (!id) return null;
  return typeof id === 'string' ? id : JSON.stringify(id);
}

export function formatCollectionFilename({ uuid }, suffix = '') {
  return [ 'wgsa', Organisms.nickname, uuid, suffix ].join('-');
}

const errorToast = {
  message: 'Failed to generate download, please try again later.',
};

export function createDownloadProps(params, dispatch) {
  const { format, download, id, getFileContents, getFileName } = params;
  const { filenameSegment, linksById = {}, ...downloadProps } = download;

  return {
    format,
    ...downloadProps,
    ...(linksById[createDownloadKey(id)] || {}),
    onClick: () => dispatch(
      requestDownload({
        format,
        id,
        getFileContents,
        idType: download.idType,
        organismId: Organisms.id,
        filename: getFileName(null, filenameSegment),
      })
    )
    .catch(() => dispatch(showToast(errorToast))),
  };
}

export function getArchiveDownloadProps(state) {
  const { collection, data } = state; // not full state :/
  return {
    ids: data.map(_ => _.id || _._id),
    filenames: {
      genome: formatCollectionFilename(collection, 'genomes.zip'),
      annotation: formatCollectionFilename(collection, 'annotations.zip'),
    },
  };
}

export function createDefaultLink(keyMap, filename) {
  const key = Object.keys(keyMap)[0];

  if (!key) {
    return null;
  }

  return (
    `${downloadPath}/${encode(key)}?filename=${encode(filename)}`
  );
}
