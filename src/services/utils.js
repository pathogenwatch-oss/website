const path = require('path');

const ASSEMBLY_FILE_EXTENSIONS = [
  '.fa',
  '.fas',
  '.fna',
  '.ffn',
  '.faa',
  '.frn',
  '.fasta',
  '.genome',
  '.contig',
  '.dna',
];

module.exports.createFastaFileName = function (genomeName = 'file') {
  const ext = path.extname(genomeName);
  if (ASSEMBLY_FILE_EXTENSIONS.includes(ext)) {
    return `${path.basename(genomeName, ext)}.fasta`;
  }
  return `${genomeName}.fasta`;
};

module.exports.getNotificationResult = function ({ task, results }) {
  switch (task) {
    case 'speciator':
      return results;
    case 'mlst':
      return {
        st: results.st,
      };
    default:
      return null;
  }
};

