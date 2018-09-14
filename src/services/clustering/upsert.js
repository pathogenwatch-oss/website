const { request } = require('services/bus');
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

  if ((results.lambda || []).length > 0) {
    console.log('FIXME: Updating the cluster');
    await Clustering.update(query, update, { upsert: true });
  } else {
    console.log('FIXME: Adding some edges');
    await Clustering.create(update);
  }
};
