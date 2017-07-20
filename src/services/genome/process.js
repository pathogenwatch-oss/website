const { request } = require('services/bus');

const DEFAULT_TASKS_CONFIG = {
  specieator: { version: 1 },
  retries: 3,
};
const { tasks = DEFAULT_TASKS_CONFIG } = require('configuration');
const { version } = tasks.specieator;
const task = 'specieator';

module.exports = function ({ genomeId, fileId, filePath, clientId }) {
  return request('tasks', 'run', { fileId, task, version })
    .then(result => {
      const { organismId } = result;
      return (
        request('tasks', 'submit-genome', { organismId, genomeId, fileId, filePath, clientId })
          .then(analysis =>
            request('genome', 'add-analysis',
              { genomeId, task, version, result, clientId, props: { analysis } }
            )
          )
        );
    });
};
