const { request } = require('services/bus');
const Clustering = require('../../models/clustering');

module.exports = async function ({ metadata, result }) {
  const { user, sessionID, scheme, clientId } = metadata;

  const query = { scheme };
  if (user) query.user = user;
  else query.sessionID = sessionID;

  await Clustering.update(query, { user, sessionID, scheme, result }, { upsert: true });

  return request('clustering', 'send-progress', { clientId, payload: { status: 'READY' } });
};
