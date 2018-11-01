const Genome = require('models/genome');
const Organism = require('models/organism');

const { getCollectionSchemes } = require('manifest');

function getSummaryFields(deployedOrganisms) {
  return [
    { field: 'organismId',
      aggregation: () => [
        { $match: { 'analysis.speciator.organismId': { $in: deployedOrganisms } } },
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
      aggregation: ({ user }) => {
        const schemes = getCollectionSchemes(user);
        return [
          {
            $group: {
              _id: {
                $cond: [
                  { $and: [
                    { $eq: [ '$reference', true ] },
                    { $in: [ '$analysis.speciator.organismId', schemes ] },
                  ] },
                  'reference',
                  { $cond: [ { $eq: [ '$public', true ] }, 'public', 'private' ] },
                ],
              },
              count: { $sum: 1 },
            },
          },
        ];
      },
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
  const deployedOrganisms = await Organism.deployedOrganismIds(props.user);
  const summaryFields = getSummaryFields(deployedOrganisms);
  const summary = await Genome.getSummary(summaryFields, props);

  return summary;
};
