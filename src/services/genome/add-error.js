const { request } = require('services/bus');

const Genome = require('models/genome');

module.exports = function ({ task, metadata: { genomeId, uploadedAt, clientId } }) {
  return Genome
    .addAnalysisError(genomeId, task)
    .then(() => request('genome', 'notify', { genomeId, clientId, uploadedAt, task, error: true }));
};
