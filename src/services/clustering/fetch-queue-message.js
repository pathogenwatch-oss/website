const Genome = require('../../models/genome');
const { queues, Queue } = require('../taskQueue');

const { getClusteringTask } = require('../../manifest');

module.exports = async function ({ user, genomeId, projection = {} }) {
  const scheme = await Genome.lookupCgMlstScheme(genomeId, user);
  const spec = getClusteringTask(scheme);

  const queueQuery = {
    type: queues.clustering,
    'message.spec.task': spec.task,
    'message.metadata.scheme': scheme,
    rejectionReason: { $exists: false },
    'message.metadata.taskId': { $exists: 1 },
  };

  if (user) {
    queueQuery['message.metadata.userId'] = user._id;
  } else {
    queueQuery['message.metadata.public'] = true;
  }

  const doc = await Queue.findOne(queueQuery, projection).lean();

  return { doc, scheme, spec };
};
