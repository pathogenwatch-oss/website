const { request } = require('services/bus');
const Clustering = require('../../models/clustering');

module.exports = async function ({ metadata, results }) {
  const { userId, scheme, taskId } = metadata;

  const query = { scheme };
  const update = { scheme, results };
  if (userId) {
    query.user = userId;
    update.user = userId;
  } else {
    query.public = true;
    update.public = true;
  }

  await Clustering.update(query, update, { upsert: true });

  return request('clustering', 'send-progress', { taskId, payload: { status: 'READY' } });
};
