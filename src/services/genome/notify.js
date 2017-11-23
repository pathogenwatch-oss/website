const { request } = require('services');

function getNotification({ task, version, results }) {
  switch (task) {
    case 'speciator':
      return { task, version, result: results };
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
