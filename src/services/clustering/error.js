const { request } = require('services');
const Clustering = require('../../models/clustering');

module.exports = async function ({ metadata }) {
  const { user, scheme, clientId, taskId } = metadata;

  await Clustering.update(
    { user, scheme },
    { status: 'FAILED' }
  );

  const payload = { status: 'FAILED' };
  return request('clustering', 'send-progress', { clientId, payload, taskId });
};
