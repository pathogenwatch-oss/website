const { request } = require('services/bus');

const Genome = require('models/genome');

module.exports = function ({ genomeId, collectionId, uploadedAt, task, clientId }) {
  if (collectionId) {
    return (
      request('collection', 'progress-error', {
        collectionId,
        assemblyId: genomeId,
        taskType: task,
      })
      .then(() => {
        request('collection', 'send-progress', { collectionId });
      })
    );
  }

  return (
    Genome.addAnalysisError(genomeId, task)
      .then(() => {
        if (clientId) {
          request('notification', 'send', {
            channel: clientId,
            topic: `analysis-${uploadedAt}`,
            message: { id: genomeId, task, result: {}, error: true },
          });
        }
      })
  );
};
