const { request } = require('services');
const { queues } = require('../taskQueue');

const { NotFoundError } = require('../../utils/errors');

module.exports = async function ({ taskId, user, genomeId }) {
  let until;
  const { doc, status } = await request('clustering', 'fetch-queue-message', { taskId, user, genomeId });
  if (status === 'NOT_QUEUED' || !doc) {
    throw new NotFoundError('Clustering job not on queue');
  }
  if (status === 'FAILED') {
    // unsure of the status here, potentially 409 Conflict?
    throw new Error('Clustering job failed');
  }
  const { position } = await request('tasks', 'queue-position', { until: doc.createdAt, type: queues.clustering });
  return { position, date: until };
};
