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

export function formatCollectionFilename({ uuid }) {
  return [ Organisms.nickname, uuid ].join('_');
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
        organismId: Organisms.id,
        filename: `wgsa_${getFileName()}_${filenameSegment}`,
      })
    )
    .catch(() => dispatch(showToast(errorToast))),
  };
}

function createPropsForDownloads(downloads, params, dispatch) {
  const { id, getFileName } = params;

  return Object.keys(downloads).reduce((memo, format) => ({
    ...memo,
    [format]: createDownloadProps({
      format,
      download: downloads[format],
      id,
      getFileName,
    }, dispatch),
  }), {});
}

export function addDownloadProps(row, { downloads }, dispatch) {
  const { uuid, name } = row;
  return {
    ...row,
    __downloads: createPropsForDownloads(downloads, {
      id: uuid,
      getFileName: () => name,
    }, dispatch),
  };
}

export function getArchiveDownloadProps(state, downloads, dispatch) {
  const { collection, data } = state; // not full state :/
  const format = 'wgsa_gff';
  return {
    gff: createDownloadProps({
      format,
      download: downloads[format],
      id: data.map(_ => _.uuid),
      getFileName: () => formatCollectionFilename(collection),
    }, dispatch),
    genome: {
      ids: data.map(_ => _.id || _._id),
      filename: formatCollectionFilename(collection),
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
