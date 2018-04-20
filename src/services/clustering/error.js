const { request } = require('services');
const Clustering = require('../../models/clustering');

module.exports = async function ({ metadata }) {
  const { user, sessionID, scheme, clientId } = metadata;

  await Clustering.update(
    { $or: [ { user }, { sessionID } ], scheme },
    { status: 'FAILED' }
  );

  const payload = { status: 'FAILED' };
  return request('clustering', 'send-progress', { clientId, payload });
};
