const { request } = require('services');

const { summariseAnalysis } = require('../../utils/analysis');

function getNotification(analysis) {
  const { task, version, results } = analysis;
  switch (task) {
    case 'speciator':
      return { task, version, result: summariseAnalysis(analysis) };
    case 'mlst':
      return { task, version, result: { st: results.st } };
    default:
      return { task, version };
  }
}

module.exports = function ({ genomeId, clientId, uploadedAt, tasks }) {
  if (clientId) {
    request('notification', 'send', {
      channel: clientId,
      topic: `analysis-${uploadedAt.toISOString()}`,
      message: { genomeId, results: tasks.map(getNotification) },
    });
  }
};
