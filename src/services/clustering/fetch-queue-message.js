const Genome = require('../../models/genome');
const { queues, Queue } = require('../taskQueue');

const { getClusteringTask } = require('../../manifest');

function getJobStatus(doc) {
  if (!doc) return 'NOT_QUEUED';
  if (doc.rejectionReason) return 'FAILED';
  return 'QUEUED';
}

module.exports = async function ({ taskId, user, genomeId, projection = {} }) {
  let scheme;
  let spec;
  const queueQuery = {
    type: queues.clustering,
  };
  if (taskId) {
    queueQuery['message.metadata.taskId'] = taskId;
  } else {
    scheme = await Genome.lookupCgMlstScheme(genomeId, user);
    spec = getClusteringTask(scheme);
    queueQuery['message.spec.task'] = spec.task;
    queueQuery['message.metadata.scheme'] = scheme;
  }

  if (user) {
    queueQuery['message.metadata.userId'] = user._id;
  } else {
    queueQuery['message.metadata.public'] = true;
  }

  const doc = await Queue.findOne(queueQuery, projection).lean();
  const status = getJobStatus(doc);

  return { doc, status, scheme, spec };
};
