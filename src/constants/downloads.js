import { requestDownload } from '../actions/downloads';

export function createDownloadKey(id) {
  return typeof id === 'string' ? id : id.join('|');
}

function createDownloadProps({ type, description, linksById = {}, ids }, dispatch) {
  const downloadKey = createDownloadKey(ids);
  return {
    description,
    ...(linksById[downloadKey] || []),
    onClick: () => dispatch(requestDownload(type, null, ids)),
  };
}

export function addDownloadProps(row, { fasta, gff }, dispatch) {
  const id = row.metadata.assemblyId;
  return {
    ...row,
    faDownloadProps:
      createDownloadProps({ type: 'fasta', ...fasta, ids: [ id ] }, dispatch),
    gffDownloadProps:
      createDownloadProps({ type: 'wgsa_gff', ...gff, ids: [ id ] }, dispatch),
  };
}

export function getArchiveDownloadProps(filter, { fasta, gff }, dispatch) {
  const ids = Array.from(filter.active ? filter.ids : filter.unfilteredIds);
  return {
    fa: createDownloadProps({ type: 'fasta', ...fasta, ids }, dispatch),
    gff: createDownloadProps({ type: 'wgsa_gff', ...gff, ids }, dispatch),
  };
}
