import { requestDownload } from '../actions/downloads';
import { showToast } from '../toast';
import { getActiveAssemblyIds } from '../collection-viewer/selectors';

import { SERVER_ADDRESS, API_ROOT } from '../utils/Api';

import Species from '../species';

export const encode = encodeURIComponent;
export const collectionPath =
  () => `${API_ROOT}/species/${Species.id}/download/file`;
export const speciesPath =
  () => `${SERVER_ADDRESS}/${Species.nickname}/download`;

export function createDownloadKey(id) {
  if (!id) return null;
  return typeof id === 'string' ? id : JSON.stringify(id);
}

export function formatCollectionFilename({ id }) {
  return [ Species.nickname, id ].join('_');
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
        speciesId: Species.id,
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
  const { assemblyId, assemblyName } = row.metadata;
  return {
    ...row,
    __downloads: createPropsForDownloads(downloads, {
      id: assemblyId,
      getFileName: () => assemblyName,
    }, dispatch),
  };
}

export function getArchiveDownloadProps(state, downloads, dispatch) {
  const { collection } = state;
  return createPropsForDownloads(downloads, {
    id: getActiveAssemblyIds(state),
    getFileName: () => formatCollectionFilename(collection),
  }, dispatch);
}
