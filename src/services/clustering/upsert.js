const { request } = require('services/bus');
const Clustering = require('../../models/clustering');

module.exports = async function ({ metadata, results }) {
  const { user, sessionID, scheme, clientId } = metadata;

  const query = { scheme };
  const update = { scheme, results };
  if (user) {
    query.user = user._id;
    update.user = user._id;
  } else {
    query.sessionID = sessionID;
    update.sessionID = sessionID;
  }

  await Clustering.update(query, update, { upsert: true });

  return request('clustering', 'send-progress', { clientId, payload: { status: 'READY' } });
};
