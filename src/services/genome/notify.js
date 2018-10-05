const { request } = require('services');

const { summariseAnalysis } = require('../../utils/analysis');
const { getFlagsForUserId } = require('../../utils/flags');

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

module.exports = async function ({ genomeId, clientId, userId, uploadedAt, tasks, task, error }) {
  if (!clientId) return Promise.resolve();
  if (userId) {
    const flags = await getFlagsForUserId(userId);
    if (!flags.showKlebExperiment()) {
      tasks = tasks.filter(_ => _.task !== 'kleborate');
      if (task === 'kleborate') return Promise.resolve();
    }
  }
  return request('notification', 'send', {
    channel: clientId,
    topic: `analysis-${uploadedAt.toISOString()}`,
    message: { genomeId, results: tasks.map(getNotification), task, error },
  });
};
