const { request } = require('services');
const { queues } = require('../taskQueue');

module.exports = async function ({ user, genomeId, date }) {
  let until = date;
  if (!until) {
    const projection = { dateCreated: 1 };
    const { doc } =
      await request('clustering', 'fetch-queue-message', { user, genomeId, projection });
    until = doc.dateCreated;
  }
  const { position } =
     await request('tasks', 'queue-position', { until, type: queues.clustering });
  return { position, date: until };
};
