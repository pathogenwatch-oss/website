const Collection = require('models/collection');

const summaryFields = [
  { field: 'organismId' },
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
];

module.exports = function (props) {
  return Collection.getSummary(summaryFields, props);
};
