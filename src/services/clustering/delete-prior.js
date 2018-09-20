const Clustering = require('../../models/clustering');

module.exports = async function ({ relatedBy = null, metadata, version }) {
  const { userId, scheme } = metadata;

  if (!relatedBy) return 'Nothing to delete';
  const query = { scheme, relatedBy: { $lt: relatedBy }, version };
  if (userId) {
    query.user = userId;
  } else {
    query.public = true;
  }

  return await Clustering.deleteMany(query);
};
