const { request } = require('services/bus');
const { createFastaFileName } = require('services/utils');
const fastaStorage = require('../../utils/fasta-store');

module.exports = function ({ id, user, type }) {
  return (
    request('genome', 'authorise', { user, id, type })
      .then((genome) => {
        const fileName = createFastaFileName(genome.name);
        const stream = fastaStorage.fetch(genome.fileId);
        return { fileName, stream };
      })
  );
};
