const Genome = require('models/genome');

const summaryFields = [
  { field: 'speciesId',
    aggregation: () => [
      { $lookup: { from: 'genomefiles', localField: '_file', foreignField: '_id', as: 'file' } },
      { $group: { _id: { label: '$file.speciesName', key: '$speciesId' }, count: { $sum: 1 } } },
    ],
  },
  { field: 'country' },
  { field: 'reference' },
  { field: 'owner',
    aggregation: ({ user = {} }) => [
      { $group: {
          _id: { $cond: [ { $eq: [ '$_user', user._id ] }, 'me', 'other' ] },
          count: { $sum: 1 },
        },
      },
    ],
  },
];

function getPrefilterCondition({ user, query }) {
  const { prefilter = 'all', uploadedAt } = query;
  if (prefilter === 'all') {
    return { binned: false };
  }
  if (prefilter === 'user') {
    return { binned: false, _user: user._id };
  }
  if (prefilter === 'upload') {
    return { binned: false, uploadedAt };
  }
  if (prefilter === 'bin') {
    return { binned: true };
  }
  throw new Error(`Invalid genome prefilter: '${prefilter}'`);
}

module.exports = function (props) {
  const { user = {} } = props;
  const prefilterAggregation = [ {
    $match: Object.assign(
      { $or: (user._id ? [ { _user: user._id } ] : []).concat({ public: true }) },
      getPrefilterCondition(props)
    ),
  } ];
  return Promise.all(
    summaryFields.map(({ field, aggregation }) =>
      Genome.aggregate(
        prefilterAggregation.concat(
          aggregation ?
            aggregation(props) :
            [ { $group: { _id: `$${field}`, count: { $sum: 1 } } } ]
        )
      )
    )
  ).
  then(results =>
    results.map(result =>
      result.reduce((memo, { _id, count }) => {
        if (_id === null) return memo;
        if (typeof _id === 'object') {
          const previousCount = memo[_id.key] ? memo[_id.key].count : 0;
          memo[_id.key] = {
            count: previousCount + count,
            label: _id.label[0],
          };
        } else {
          memo[_id] = { count };
        }
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
