const Genome = require('models/genome');
const Organism = require('models/organism');

async function getWgsaOrganisms() {
  const docs = await Organism
    .find({}, { taxId: 1 })
    .lean();
  return docs.map(_ => _.taxId);
}

function getSummaryFields(wgsaOrganisms) {
  return [
    { field: 'organismId',
      aggregation: () => [
        { $match: { 'analysis.speciator.organismId': { $in: wgsaOrganisms } } },
        { $group: { _id: { label: '$analysis.speciator.organismName', key: '$analysis.speciator.organismId' }, count: { $sum: 1 } } },
      ],
    },
    { field: 'speciesId',
      aggregation: ({ query }) => {
        if (query.genusId || query.organismId) {
          return [
            { $match: { 'analysis.speciator.speciesId': { $exists: true } } },
            { $group: { _id: { label: '$analysis.speciator.speciesName', key: '$analysis.speciator.speciesId' }, count: { $sum: 1 } } },
          ];
        }
        return null;
      },
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
      aggregation: ({ user }) => {
        if (!user) return null;
        const $match = { _user: user._id };
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
          { $group: { _id: '$analysis.mlst.st', count: { $sum: 1 } } },
        ];
      },
    },
    { field: 'amr',
      aggregation: () => [
        { $project: { 'analysis.paarsnp.antibiotics': 1 } },
        { $unwind: '$analysis.paarsnp.antibiotics' },
        { $match: { 'analysis.paarsnp.antibiotics.state': 'RESISTANT' } },
        { $group: { _id: '$analysis.paarsnp.antibiotics.fullName', count: { $sum: 1 } } },
      ],
    },
  ];
}

module.exports = async function (props) {
  const { user } = props;
  const wgsaOrganisms = await getWgsaOrganisms();
  const summaryFields = getSummaryFields(wgsaOrganisms);
  const summary = await Genome.getSummary(summaryFields, props);

  if (summary.organismId['573'] && (!user || !user.showKlebExperiment)) {
    delete summary.organismId['573'];
  }

  return summary;
};
