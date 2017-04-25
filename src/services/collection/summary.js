const Collection = require('models/collection');

const summaryFields = [
  { field: 'organismId' },
  { field: 'owner',
    aggregation: ({ user }) => {
      if (!user) return null;
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
