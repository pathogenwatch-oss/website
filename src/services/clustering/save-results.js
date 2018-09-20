const Clustering = require('../../models/clustering');

module.exports = async function ({ metadata, results, version }) {
  const { userId, scheme } = metadata;

  const query = { scheme };
  const update = { scheme, version, ...results };
  if (userId) {
    query.user = userId;
    update.user = userId;
  } else {
    query.public = true;
    update.public = true;
  }

  if ((results.STs || []).length > 0) {
    query['STs.1'] = { $exists: true };
    await Clustering.update(query, update, { upsert: true });
  } else {
    await Clustering.create(update);
  }
};
