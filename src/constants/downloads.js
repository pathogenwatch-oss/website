import { requestDownload } from '../actions/downloads';

import Species from '../species';

export function createDownloadKey(id) {
  if (!id) return null;
  return typeof id === 'string' ? id : id.join('|');
}

export function createFilename(formatName, collectionId, assemblyName) {
  return (
    `wgsa_${Species.nickname}_${collectionId}_${ formatName}` +
    `${assemblyName ? `_${assemblyName}` : ''}`
  );
}

function createDownloadProps(downloads, { idList, filenameParams }, dispatch) {
  return Object.keys(downloads).reduce((memo, format) => {
    const { description, filename, linksById = {} } = downloads[format];
    const downloadKey = createDownloadKey(idList);
    memo[format] = {
      description,
      ...(linksById[downloadKey] || []),
      onClick: () => dispatch(
        requestDownload({
          format,
          idList,
          filename: createFilename(filename, ...filenameParams),
        })
      ),
    };
    return memo;
  }, {});
}

export function addDownloadProps(row, { collection, downloads }, dispatch) {
  const { assemblyId, assemblyName } = row.metadata;
  return {
    ...row,
    __downloads: createDownloadProps(downloads, {
      idList: [ assemblyId ],
      filenameParams: [ collection.id, assemblyName ],
    }, dispatch),
  };
}

export function getArchiveDownloadProps(state, downloads, dispatch) {
  const { filter, collection } = state;
  const idList = Array.from(filter.active ? filter.ids : filter.unfilteredIds);
  return createDownloadProps(downloads, {
    idList,
    filenameParams: [ collection.id ],
  }, dispatch);
}
