const Genome = require('models/genome');

const summaryFields = [
  { field: 'organismId',
    aggregation: () => [
      { $group: { _id: { label: '$analysis.speciator.organismName', key: '$organismId' }, count: { $sum: 1 } } },
    ],
  },
  { field: 'speciesId',
    aggregation: () => [
      { $group: { _id: { label: '$analysis.speciator.speciesName', key: '$analysis.speciator.speciesId' }, count: { $sum: 1 } } },
    ],
  },
  { field: 'genusId',
    aggregation: () => [
      { $group: { _id: { label: '$analysis.speciator.genusName', key: '$analysis.speciator.genusId' }, count: { $sum: 1 } } },
    ],
  },
  { field: 'country' },
  { field: 'type',
    aggregation: ({}) => [
      {
        $group: {
          _id: {
            $cond: [
              { $eq: [ '$reference', true ] },
              'reference',
              { $cond: [ { $eq: [ '$public', true ] }, 'public', 'private' ] },
            ],
          },
          count: { $sum: 1 },
        },
      },
    ],
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
  { field: 'date', range: true, queryKeys: [ 'minDate', 'maxDate' ] },
  { field: 'analysis.mlst.st',
    aggregation: ({ query = {} }) => {
      if (!query.organismId) return null;
      return [
        { $group: { _id: '$analysis.mlst.st', count: { $sum: 1 } } },
      ];
    },
    queryKeys: [ 'sequenceType' ],
  },
];

module.exports = function (props) {
  return Genome.getSummary(summaryFields, props);
};
