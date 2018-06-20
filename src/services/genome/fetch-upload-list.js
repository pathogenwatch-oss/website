const Genome = require('models/genome');

module.exports = function (props) {
  const $match = props.user ? { _user: props.user._id } : null;
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
