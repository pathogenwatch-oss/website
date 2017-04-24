const Genome = require('models/genome');

const summaryFields = [
  { field: 'organismId',
    aggregation: () => [
      { $lookup: { from: 'genomefiles', localField: '_file', foreignField: '_id', as: 'file' } },
      { $group: { _id: { label: '$file.organismName', key: '$organismId' }, count: { $sum: 1 } } },
    ],
  },
  { field: 'country' },
  { field: 'reference' },
  { field: 'owner',
    requiredProps: [ 'user' ],
    aggregation: ({ user }) => [
      { $group: {
          _id: { $cond: [ { $eq: [ '$_user', user._id ] }, 'me', 'other' ] },
          count: { $sum: 1 },
        },
      },
    ],
  },
];

module.exports = function (props) {
  return Genome.getSummary(summaryFields, props);
};
