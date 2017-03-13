const path = require('path');

const { request } = require('services/bus');

function createFastaFileName(genomeName = 'file') {
  return path.extname(genomeName || '').length ?
    genomeName :
    `${genomeName}.fasta`;
}

module.exports = function ({ id, user, type }) {
  return (
    request('genome', 'fetch-one', { id, user, type })
      .then(genome => Promise.all([
        Promise.resolve(createFastaFileName(genome.name)),
        request('genome', 'file-path', { fileId: genome.fileId || genome._file.fileId }),
      ]))
      .then(([ fileName, filePath ]) => ({ fileName, filePath }))
  );
};
