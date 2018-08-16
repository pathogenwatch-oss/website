const { request } = require('services');
const { enqueue, queues } = require('../taskQueue');
const rand = require('rand-token');

module.exports = async function ({ user, genomeId, clientId }) {
  const { doc, scheme, spec } =
    await request('clustering', 'fetch-queue-message', { user, genomeId });

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
