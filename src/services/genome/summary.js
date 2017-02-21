const Genome = require('models/genome');

const summaryFields = [
  { field: 'speciesId' },
  { field: 'country' },
  { field: 'reference' },
  { field: 'owner',
    aggregation: ({ user = {} }) => [
      { $match: { $or: (user._id ? [ { _user: user._id } ] : []).concat({ public: true }) } },
      { $group: {
          _id: { $cond: [ { $eq: [ '$_user', user._id ] }, 'me', 'other' ] },
          total: { $sum: 1 },
        },
      },
    ],
  },
];

module.exports = function (props) {
  return Promise.all(
    summaryFields.map(({ field, aggregation }) =>
      Genome.aggregate(
        aggregation ?
          aggregation(props) :
          { $group: { _id: `$${field}`, total: { $sum: 1 } } }
      )
    )
  ).
  then(results =>
    results.map(result =>
      result.reduce((memo, { _id, total }) => {
        memo[_id] = total;
        return memo;
      }, {})
    )
  ).
  then(results =>
    results.reduce((memo, result, index) => {
      memo[summaryFields[index].field] = result;
      return memo;
    }, {})
  );
};
