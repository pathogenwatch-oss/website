const Genome = require('models/genome');

const summaryFields = [
  { field: 'organismId',
    aggregation: () => [
      { $lookup: { from: 'genomefiles', localField: '_file', foreignField: '_id', as: 'file' } },
      { $group: { _id: { label: '$file.organismName', key: '$organismId' }, count: { $sum: 1 } } },
    ],
  },
  { field: 'country' },
  { field: 'reference',
    aggregation: ({ query = {} }) => {
      if (query.prefilter !== 'all') return null;
      return [
        { $group: { _id: '$reference', count: { $sum: 1 } } },
      ];
    },
  },
  { field: 'owner',
    aggregation: ({ user, query = {} }) => {
      if (!user) return null;
      if (query.prefilter !== 'all') return null;
      return [
        { $group: {
            _id: { $cond: [ { $eq: [ '$_user', user._id ] }, 'me', 'other' ] },
            count: { $sum: 1 },
          },
        },
      ];
    },
  },
  { field: 'uploadedAt',
    aggregation: ({ user, query = {} }) => {
      if (!user) return null;
      if (query.prefilter === 'upload') return null;
      return [
        { $match: { _user: user._id } },
        { $group: { _id: '$uploadedAt', count: { $sum: 1 } } },
      ];
    },
  },
];

module.exports = function (props) {
  return Genome.getSummary(summaryFields, props);
};
