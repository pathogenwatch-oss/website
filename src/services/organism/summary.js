const Reference = require('models/reference');
const Collection = require('models/collection');
const Genome = require('models/genome');

const collectionsFields = [ { field: 'organismId' } ];
const genomeFields = [
  { field: 'organismId',
    aggregation: () => [
      { $group: { _id: { label: '$analysis.speciator.organismName', key: '$organismId' }, count: { $sum: 1 } } },
    ],
  },
];

module.exports = function (props) {
  return Promise.all([
    Reference.distinct('organismId'),
    Collection.getSummary(collectionsFields, props),
    Genome.getSummary(genomeFields, props),
  ]).
  then(([ deployedOrganismIds, collectionSummary, genomeSummary ]) => {
    const deployedOrganisms = new Set(deployedOrganismIds);
    return {
      wgsaOrganisms: deployedOrganismIds
        .map(organismId => ({
          organismId,
          totalCollections: (collectionSummary.organismId[organismId] || { count: 0 }).count,
          totalGenomes: (genomeSummary.organismId[organismId] || { count: 0 }).count,
        })),
      otherOrganisms: Object.keys(genomeSummary.organismId)
        .filter(organismId => !(deployedOrganisms.has(organismId)))
        .map(organismId => ({
          organismId,
          organismName: genomeSummary.organismId[organismId].label,
          totalGenomes: genomeSummary.organismId[organismId].count,
        })),
    };
  });
};
