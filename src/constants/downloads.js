import { requestDownload } from '../actions/downloads';

import Species from '../species';

export function createDownloadKey(id) {
  if (!id) return null;
  return typeof id === 'string' ? id : id.join('|');
}

export function createFilename(formatName, collectionId, assemblyName) {
  return (
    `wgsa_${Species.nickname}_` +
    `${assemblyName ? formatName : collectionId}_` +
    `${assemblyName ? assemblyName : formatName}`
  );
}

function createDownloadProps(args, dispatch) {
  const { format, description, filename, linksById = {}, idList } = args;
  const downloadKey = createDownloadKey(idList);
  return {
    description,
    ...(linksById[downloadKey] || []),
    onClick: () => dispatch(requestDownload({ format, idList, filename })),
  };
}

export function addDownloadProps(row, { fasta, gff }, dispatch) {
  const id = row.metadata.assemblyId;
  const assemblyName = row.metadata.assemblyName;
  return {
    ...row,
    faDownloadProps:
      createDownloadProps({
        format: 'fasta',
        ...fasta,
        filename: createFilename(fasta.filename, null, assemblyName),
        idList: [ id ],
      }, dispatch),
    gffDownloadProps:
      createDownloadProps({
        format: 'wgsa_gff',
        ...gff,
        filename: createFilename(gff.filename, null, assemblyName),
        idList: [ id ],
      }, dispatch),
  };
}

export function getArchiveDownloadProps(state, { fasta, gff }, dispatch) {
  const { filter, collection } = state;
  const idList = Array.from(filter.active ? filter.ids : filter.unfilteredIds);
  return {
    fa: createDownloadProps({
      format: 'fasta',
      ...fasta,
      idList,
      filename: createFilename(fasta.filename, collection.id),
    }, dispatch),
    gff: createDownloadProps({
      format: 'wgsa_gff',
      ...gff,
      idList,
      filename: createFilename(gff.filename, collection.id),
    }, dispatch),
  };
}
