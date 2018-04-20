const Clustering = require('../../models/clustering');

module.exports = async function ({ user, sessionID, scheme }) {
  return Clustering.findOne({ $or: [ { user }, { sessionID } ], scheme });
};
