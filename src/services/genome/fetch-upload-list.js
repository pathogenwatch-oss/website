const Genome = require('models/genome');

function getMatch({ user, sessionID }) {
  if (user) return { _user: user._id };
  if (sessionID) return { _session: sessionID };
  return null;
}

module.exports = function (props) {
  const $match = getMatch(props);
  if (!$match) return [];
  return (
    Genome.aggregate([
      { $match },
      { $group: { _id: '$uploadedAt', total: { $sum: 1 } } },
      { $project: { uploadedAt: '$_id', _id: 0, total: 1 } },
      { $sort: { uploadedAt: -1 } },
    ])
  );
};
