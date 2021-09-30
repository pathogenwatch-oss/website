const { request } = require('services');
const { enqueue } = require('models/queue');
const rand = require('rand-token');
const { getTaskPriority } = require('../utils');

module.exports = async function ({ user, genomeId, clientId }) {
  const { doc, status, scheme, spec } =
    await request('clustering', 'fetch-queue-message', { user, genomeId });

  if (status === 'QUEUED') {
    return { ok: 1, taskId: doc.message.metadata.taskId };
  }

  const taskId = rand.generate(16);
  const metadata = { scheme, clientId, taskId };
  if (user) {
    metadata.userId = user._id;
  } else {
    metadata.public = true;
  }

  const priority = await getTaskPriority('clustering', user._id);
  await enqueue({ spec, metadata, priority });
  return { ok: 1, taskId };
};
