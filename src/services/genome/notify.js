const { request } = require('services');

const { summariseAnalysis } = require('../../utils/analysis');
const User = require('models/user');
const { ESBL_CPE_EXPERIMENT_TAXIDS, ESBL_CPE_EXPERIMENT_TASKS } = require('models/user');
const Genome = require('models/genome');

function getNotification(analysis) {
  const { task, version, results, error } = analysis;
  switch (task) {
    case 'speciator':
      return { task, version, result: summariseAnalysis(analysis), error };
    case 'mlst':
      return { task, version, result: { st: results.st }, error };
    default:
      return { task, version, error };
  }
}

module.exports = async function ({ genomeId, clientId, uploadedAt, tasks = [] }) {
  if (!clientId) return Promise.resolve();
  return request('notification', 'send', {
    channel: clientId,
    topic: `analysis-${uploadedAt.toISOString()}`,
    message: { genomeId, results: tasks.map(getNotification) },
  });
};
