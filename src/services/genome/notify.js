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

module.exports = async function ({ speciator, genomeId, clientId, userId, uploadedAt, tasks = [] }) {
  if (!clientId) return Promise.resolve();
  if (userId) {
    const user = await User.findById(userId, { flags: 1 });
    if (
      (!user || !user.showEsblCpeExperiment) &&
      Genome.taxonomy({ analysis: { speciator } }).isIn(ESBL_CPE_EXPERIMENT_TAXIDS)
    ) {
      tasks = tasks.filter(_ => !ESBL_CPE_EXPERIMENT_TASKS.includes(_.task));
    }
  }
  return request('notification', 'send', {
    channel: clientId,
    topic: `analysis-${uploadedAt.toISOString()}`,
    message: { genomeId, results: tasks.map(getNotification) },
  });
};
