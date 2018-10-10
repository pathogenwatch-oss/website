const { request } = require('services/bus');

const Genome = require('models/genome');

module.exports = function ({ task, metadata: { genomeId, uploadedAt, clientId, userId } }) {
  return Genome
    .addAnalysisError(genomeId, task)
    .then(() => request('genome', 'notify', { genomeId, clientId, userId, uploadedAt, task, error: true }));
};
