const { enqueue, queues, Queue } = require('../taskQueue');

const { getClusteringTask } = require('../../manifest');

const { ServiceRequestError } = require('../../utils/errors');

module.exports = async function ({ user, scheme, clientId }) {
  const spec = getClusteringTask(scheme);

  const count = await Queue.count({
    type: queues.clustering,
    'message.spec.task': spec.task,
    'message.metadata.user': user,
    'message.metadata.scheme': scheme,
    rejectionReason: { $exists: false },
  });

  if (count > 0) {
    throw new ServiceRequestError('Already queued this job');
  }

  await enqueue(queues.clustering, { spec, metadata: { user, scheme, clientId } });
  return { ok: 1 };
};
