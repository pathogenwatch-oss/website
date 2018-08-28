const { request } = require('services/bus');
const { createFastaFileName } = require('services/utils');

module.exports = function ({ id, user, type }) {
  return (
    request('genome', 'authorise', { user, id, type })
      .then(genome => Promise.all([
        Promise.resolve(createFastaFileName(genome.name)),
        request('genome', 'file-path', { fileId: genome.fileId }),
      ]))
      .then(([ fileName, filePath ]) => ({ fileName, filePath }))
  );
};
