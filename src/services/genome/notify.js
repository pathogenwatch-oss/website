const { request } = require('services');

const { summariseAnalysis } = require('../../utils/analysis');

function getNotification(analysis) {
  const { task, version, results, error } = analysis;
  if (error) return { task, version, result: error, error };
  switch (task) {
    case 'speciator':
      return { task, version, result: summariseAnalysis(analysis), error };
    case 'mlst':
    case 'mlst2':
      return { task, version, result: { st: results.st, source: results.source }, error };
    case 'cgmlst':
      return { task, version, result: { source: results.source }, error };
    case 'pangolin':
      return { task, version, result: { lineage: results.lineage }, error };
    default:
      return { task, version, error };
  }
}

module.exports = async function ({ genomeId, clientId, uploadedAt, tasks = [] }) {
  if (!clientId) return Promise.resolve();
  return request('notification', 'send', {
    channel: `${clientId}-analysis`,
    topic: uploadedAt.toISOString(),
    message: { genomeId, results: tasks.map(getNotification) },
  });
};
