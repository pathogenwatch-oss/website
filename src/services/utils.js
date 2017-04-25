const path = require('path');

module.exports.createFastaFileName = function (genomeName = 'file') {
  const ext = path.extname(genomeName);
  if (ext.length === 0) return `${genomeName}.fasta`;
  return `${path.basename(genomeName, ext)}.fasta`;
};
