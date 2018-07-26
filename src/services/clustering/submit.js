const Genome = require('../../models/genome');
const { enqueue, queues, Queue } = require('../taskQueue');
const rand = require('rand-token');

const { getClusteringTask } = require('../../manifest');

module.exports = async function ({ user, genomeId, clientId }) {
  const scheme = await Genome.lookupCgMlstScheme(genomeId, user);

  const spec = getClusteringTask(scheme);

  const doc = await Queue.findOne({
    type: queues.clustering,
    'message.spec.task': spec.task,
    'message.metadata.user': user,
    'message.metadata.scheme': scheme,
    rejectionReason: { $exists: false },
    'message.metadata.taskId': { $exists: 1 },
  }, {
    'message.metadata.taskId': 1,
  }).lean();

  if (doc) {
    return { ok: 1, taskId: doc.message.metadata.taskId };
  }

  const taskId = rand.generate(16);
  await enqueue(queues.clustering, { spec, metadata: { user, scheme, clientId, taskId } });
  return { ok: 1, taskId };
};
