const { request } = require('services/bus');

const Genome = require('models/genome');

module.exports = function ({ task, metadata: { genomeId, uploadedAt, clientId } }) {
  return (
    Genome.addAnalysisError(genomeId, task)
      .then(() => {
        if (clientId) {
          request('notification', 'send', {
            channel: clientId,
            topic: `analysis-${uploadedAt.toISOString()}`,
            message: { id: genomeId, task, result: {}, error: true },
          });
        }
      })
  );
};
