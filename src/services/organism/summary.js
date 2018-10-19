const Organism = require('models/organism');
const Collection = require('models/collection');
const Genome = require('models/genome');

async function getSupportedGenomeSummary(props) {
  const { user } = props;

  const deployedOrganisms = await Organism.distinct('taxId')
    .filter(taxId => {
      if (taxId === '573' && (!user || !user.showEsblCpeExperiment)) return false;
      if (taxId === '498019' && (!user || !user.showCandidaExperiment)) return false;
      return true;
    });
  return Genome.getSummary([
    { field: 'organismId',
      aggregation: () => [
        { $match: { 'analysis.speciator.organismId': { $in: deployedOrganisms } } },
        { $group: { _id: '$analysis.speciator.organismId', count: { $sum: 1 } } },
      ] },
  ], props);
}

const speciesSummary = [
  { field: 'speciesId',
    aggregation: () => [
      { $match: { 'analysis.speciator.speciesId': { $exists: true } } },
      { $group: { _id: { label: '$analysis.speciator.speciesName', key: '$analysis.speciator.speciesId' }, count: { $sum: 1 } } },
    ],
  },
];

module.exports = async function (props) {
  const [
    supportedGenomeSummary, collectionSummary, genomeSummary,
  ] = await Promise.all([
    getSupportedGenomeSummary(props),
    Collection.getSummary([ { field: 'organismId' } ], props),
    Genome.getSummary(speciesSummary, props),
  ]);

  return {
    supportedOrganisms: Object.keys(supportedGenomeSummary.organismId)
      .map(organismId => ({
        organismId,
        totalCollections: (collectionSummary.organismId[organismId] || { count: 0 }).count,
        totalGenomes: (supportedGenomeSummary.organismId[organismId] || { count: 0 }).count,
      })),
    allSpecies: Object.keys(genomeSummary.speciesId)
      .map(speciesId => ({
        speciesId,
        speciesName: genomeSummary.speciesId[speciesId].label,
        totalGenomes: genomeSummary.speciesId[speciesId].count,
      })),
  };
};
