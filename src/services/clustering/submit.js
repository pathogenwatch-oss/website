const Genome = require('../../models/genome');
const { enqueue, queues, Queue } = require('../taskQueue');
const rand = require('rand-token');

const { getClusteringTask } = require('../../manifest');

const { ServiceRequestError } = require('../../utils/errors');

module.exports = async function ({ user, genomeId, clientId }) {
  const scheme = await Genome.lookupCgMlstScheme(genomeId, user);

  const spec = getClusteringTask(scheme);

  const queueQuery = {
    type: queues.clustering,
    'message.spec.task': spec.task,
    'message.metadata.scheme': scheme,
    rejectionReason: { $exists: false },
  };

  if (user) {
    queueQuery['message.metadata.userId'] = user._id;
  } else {
    queueQuery['message.metadata.public'] = true;
  }
  const count = await Queue.count(queueQuery);

  if (count > 0) {
    throw new ServiceRequestError('Already queued this job');
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
