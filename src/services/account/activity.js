const services = require('services');
const Genome = require('models/genome');

const limit = 10;

function findRecentUploadSessions(user) {
  return Genome.aggregate([
    { $match: { _user: user._id, uploadedAt: { $exists: true } } },
    { $group: { _id: '$uploadedAt', count: { $sum: 1 } } },
    { $project: { _id: 0, count: 1, date: '$_id', type: 'genome' } },
    { $sort: { uploadedAt: -1 } },
    { $limit: limit },
  ]);
}

function findRecentCollections(user) {
  const options = { user, query: { prefilter: 'user', limit } };
  return (
    services.request('collection', 'fetch-list', options)
      .then(collections =>
        collections.map(_ => ({
          date: _.createdAt,
          type: 'collection',
          size: _.size,
          organismId: _.organismId,
          token: _.token,
          title: _.title,
        }))
      )
  );
}

module.exports = ({ user }) =>
  Promise.all([
    findRecentCollections(user),
    findRecentUploadSessions(user),
  ])
  .then(([ collections, uploads ]) =>
    collections
      .concat(uploads)
      .sort((a, b) => b.date - a.date)
      .slice(0, limit) // ensures combined items capped to limit
  );
