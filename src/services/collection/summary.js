const Collection = require('models/collection');

const summaryFields = [
  { field: 'organismId' },
  { field: 'type',
    aggregation: () => [
      {
        $group: {
          _id: {
            $cond: [ { $eq: [ '$public', true ] }, 'public', 'private' ],
          },
          count: { $sum: 1 },
        },
      },
    ],
  },
];

module.exports = function (props) {
  return Collection.getSummary(summaryFields, props);
};
