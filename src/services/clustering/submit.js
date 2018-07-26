const Genome = require('../../models/genome');
const { enqueue, queues, Queue } = require('../taskQueue');
const rand = require('rand-token');

const { getClusteringTask } = require('../../manifest');

module.exports = async function ({ user, genomeId, clientId }) {
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

  const doc = await Queue.findOne(queueQuery, {
    'message.metadata.taskId': 1,
  }).lean();

  if (doc) {
    return { ok: 1, taskId: doc.message.metadata.taskId };
  }

  const taskId = rand.generate(16);
  const metadata = { scheme, clientId, taskId };
  if (user) {
    metadata.userId = user._id;
  } else {
    metadata.public = true;
  }

  await enqueue(queues.clustering, { spec, metadata });
  return { ok: 1, taskId };
};
