const organisms = require('wgsa-front-end/universal/organisms');
const Genome = require('models/genome');

const wgsaOrganisms = organisms.map(_ => _.id);

const summaryFields = [
  { field: 'organismId',
    aggregation: () => [
      { $match: { organismId: { $in: wgsaOrganisms } } },
      { $group: { _id: { label: '$analysis.speciator.organismName', key: '$organismId' }, count: { $sum: 1 } } },
    ],
  },
  { field: 'speciesId',
    aggregation: () => [
      { $match: { 'analysis.speciator.speciesId': { $exists: true } } },
      { $group: { _id: { label: '$analysis.speciator.speciesName', key: '$analysis.speciator.speciesId' }, count: { $sum: 1 } } },
    ],
  },
  { field: 'genusId',
    aggregation: () => [
      { $match: { 'analysis.speciator.genusId': { $exists: true } } },
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
  { field: 'analysis.mlst.st',
    aggregation: ({ query = {} }) => {
      if (!query.organismId && !query.speciesId && !query.genusId) return null;
      return [
        { $group: { _id: '$analysis.mlst.st', count: { $sum: 1 } } },
      ];
    },
    queryKeys: [ 'sequenceType' ],
  },
  { field: 'analysis.paarsnp.antibiotics.fullName',
    aggregation: () => [
      { $project: { 'analysis.paarsnp.antibiotics': 1 } },
      { $unwind: '$analysis.paarsnp.antibiotics' },
      { $match: { 'analysis.paarsnp.antibiotics.state': 'RESISTANT' } },
      { $group: { _id: '$analysis.paarsnp.antibiotics.fullName', count: { $sum: 1 } } },
    ],
    queryKeys: [ 'resistance' ],
  },
];

module.exports = function (props) {
  return Genome.getSummary(summaryFields, props);
};
