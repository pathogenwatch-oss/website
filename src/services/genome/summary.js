const organisms = require('wgsa-front-end/universal/organisms');
const Genome = require('models/genome');

const wgsaOrganisms = organisms.map(_ => _.id);

const summaryFields = [
  { field: 'organismId',
    aggregation: () => [
      { $match: { organismId: { $in: wgsaOrganisms } } },
      { $group: { _id: { label: '$organismName', key: '$organismId' }, count: { $sum: 1 } } },
    ],
  },
  { field: 'speciesId',
    aggregation: () => [
      { $match: { speciesId: { $exists: true } } },
      { $group: { _id: { label: '$speciesName', key: '$speciesId' }, count: { $sum: 1 } } },
    ],
  },
  { field: 'genusId',
    aggregation: () => [
      { $match: { genusId: { $exists: true } } },
      { $group: { _id: { label: '$genusName', key: '$genusId' }, count: { $sum: 1 } } },
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
    aggregation: ({ user, sessionID }) => {
      if (!user && !sessionID) return null;
      const $match = { $or: [] };
      if (user) $match.$or.push({ _user: user._id });
      if (sessionID) $match.$or.push({ _session: sessionID });
      return [
        { $match },
        { $group: { _id: '$uploadedAt', count: { $sum: 1 } } },
      ];
    },
  },
  { field: 'date', range: true, queryKeys: [ 'minDate', 'maxDate' ] },
  { field: 'st',
    aggregation: ({ query = {} }) => {
      if (!query.organismId && !query.speciesId && !query.genusId) return null;
      return [
        { $group: { _id: '$st', count: { $sum: 1 } } },
      ];
    },
    queryKeys: [ 'sequenceType' ],
  },
  { field: 'amr',
    aggregation: () => [
      { $project: { amr: 1 } },
      { $unwind: '$amr' },
      { $group: { _id: '$amr', count: { $sum: 1 } } },
    ],
    queryKeys: [ 'resistance' ],
  },
];

module.exports = function (props) {
  return Genome.getSummary(summaryFields, props);
};
