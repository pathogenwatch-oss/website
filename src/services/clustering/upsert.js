const { request } = require('services/bus');
const Clustering = require('../../models/clustering');

module.exports = async function ({ metadata, results }) {
  const { user, sessionID, scheme, clientId } = metadata;

  const query = { scheme };
  if (user) query.user = user;
  else query.sessionID = sessionID;

  await Clustering.update(query, { user, sessionID, scheme, results }, { upsert: true });

  return request('clustering', 'send-progress', { clientId, payload: { status: 'READY' } });
};
