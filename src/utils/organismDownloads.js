module.exports = {
  'core_representatives.csv': {
    contentType: 'text/csv',
    fileOnDisk: () => 'core_rep_map.tsv',
  },
  'reference_fastas.zip': {
    contentType: 'application/zip',
    fileOnDisk: () => 'fastas.zip',
  },
  'reference_annotations.zip': {
    contentType: 'application/zip',
    fileOnDisk: (organismId) => `wgsa_gff_${organismId}.zip`,
  },
  'reference_metadata.csv': {
    contentType: 'text/csv',
    fileOnDisk: () => 'metadata.csv',
  },
};
