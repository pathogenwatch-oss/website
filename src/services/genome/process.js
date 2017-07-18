const { request } = require('services/bus');

const Genome = require('models/genome');

const { tasks } = require('configuration');
const { version } = tasks.specieator;

const task = 'specieator';

module.exports = function ({ genomeId, fileId, filePath, clientId }) {
  return request('tasks', 'run', { fileId, task, version })
    .then(result => {
      const organismId = result.speciesTaxId;
      return Promise.all([
        Genome.update({ _id: genomeId }, { organismId }),
        request('genome', 'add-analysis', { genomeId, task, version, result, clientId }),
        request('tasks', 'submit-genome', { organismId, genomeId, fileId, filePath, clientId }),
      ]);
    });
};
