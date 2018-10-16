const { request } = require('services/bus');

const Genome = require('models/genome');

module.exports = function ({ task, metadata }) {
  const { genomeId, uploadedAt, clientId, userId } = metadata;
  const { organismId, speciesId, genusId } = metadata;
  const speciator = { organismId, speciesId, genusId };
  return Genome
    .addAnalysisError(genomeId, task)
    .then(() => request('genome', 'notify', { speciator, genomeId, clientId, userId, uploadedAt, tasks: [ { task, error: true } ] }));
};
