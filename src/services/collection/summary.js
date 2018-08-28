const Collection = require('models/collection');

const summaryFields = [
  { field: 'organismId' },
  { field: 'type',
    aggregation: () => [
      {
        $group: {
          _id: {
            $cond: [ { $eq: [ '$access', 'public' ] }, 'public', 'private' ],
          },
          count: { $sum: 1 },
        },
      },
    ],
  },
  { field: 'createdAt', range: true, queryKeys: [ 'minDate', 'maxDate' ] },
  { field: 'publicationYear' },
];

module.exports = function (props) {
  return Collection.getSummary(summaryFields, props);
};
