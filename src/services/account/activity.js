const services = require('services');
const Genome = require('models/genome');

function findRecentUploadSessions(user) {
  return Genome.aggregate([
    { $match: { _user: user._id, uploadedAt: { $exists: true } } },
    { $group: { _id: '$uploadedAt', count: { $sum: 1 } } },
    { $project: { _id: 0, count: 1, date: '$_id', type: 'genome' } },
    { $sort: { uploadedAt: -1 } },
    { $limit: 10 },
  ]);
}

function findRecentCollections(user) {
  const options = { user, query: { prefilter: 'user', limit: 10 } };
  return (
    services.request('collection', 'fetch-list', options)
      .then(collections => collections.map(_ => ({
        date: _.createdAt,
        type: 'collection',
        size: _.size,
        organismId: _.organismId,
      })))
  );
}

module.exports = ({ user }) =>
  Promise.all([
    findRecentCollections(user),
    findRecentUploadSessions(user),
  ])
  .then(([ collections, uploads ]) =>
    collections.concat(uploads).sort((a, b) => b.date - a.date)
  );
