const { request } = require('services/bus');
const { createFastaFileName } = require('services/utils');

module.exports = function ({ id, user, sessionID, type }) {
  return (
    request('genome', 'fetch-one', { id, user, sessionID, type })
      .then(genome => Promise.all([
        Promise.resolve(createFastaFileName(genome.name)),
        request('genome', 'file-path', { fileId: genome.fileId }),
      ]))
      .then(([ fileName, filePath ]) => ({ fileName, filePath }))
  );
};
