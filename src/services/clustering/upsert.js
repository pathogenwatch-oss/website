const { request } = require('services/bus');
const Clustering = require('../../models/clustering');

module.exports = async function ({ metadata, results, version }) {
  const { user, scheme, taskId } = metadata;

  const query = { scheme };
  const update = { scheme, results, version };
  if (user) {
    query.user = user._id;
    update.user = user._id;
  } else {
    query.public = true;
    update.public = true;
  }

  await Clustering.update(query, update, { upsert: true });

  return request('clustering', 'send-progress', { taskId, payload: { status: 'READY' } });
};
