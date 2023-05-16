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
  const cleanName = genomeName.replace('/', '|');
  if (ASSEMBLY_FILE_EXTENSIONS.includes(ext)) {
    return `${path.basename(cleanName, ext)}.fasta`;
  }
  return `${cleanName}.fasta`;
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

