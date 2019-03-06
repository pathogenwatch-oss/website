const Genome = require('models/genome');

module.exports = function (props) {
  const $match = props.user ? { _user: props.user._id } : null;
  if (!$match) return [];
  return Genome.aggregate([
    { $match },
    { $project: { uploadedAt: 1, upload: 1, fileId: 1 } },
    {
      $group: {
        _id: '$uploadedAt',
        total: { $sum: 1 },
        complete: {
          $sum: { $cond: [ { $or: [ '$upload.complete', { $ifNull: [ '$fileId', false ] } ] }, 1, 0 ] },
        },
      },
    },
    { $project: { uploadedAt: '$_id', _id: 0, total: 1, complete: 1 } },
    { $sort: { uploadedAt: -1 } },
  ]);
};
