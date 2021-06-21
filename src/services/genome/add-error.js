const { request } = require('services/bus');

const Genome = require('models/genome');

module.exports = function ({ spec, metadata }) {
  const { task, version } = spec;
  const { genomeId, uploadedAt, clientId } = metadata;
  return Genome
    .addAnalysisError(genomeId, task)
    .then(() => request('genome', 'notify', { genomeId, clientId, uploadedAt, tasks: [ { task, version, error: true } ] }));
};
