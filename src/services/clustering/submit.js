const { request } = require('services');
const { enqueue } = require('models/queue');
const rand = require('rand-token');

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

  await enqueue({ spec, metadata });
  return { ok: 1, taskId };
};
