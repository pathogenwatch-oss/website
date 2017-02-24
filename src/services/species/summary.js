const Species = require('models/species');
const Collection = require('models/collection');
const Genome = require('models/genome');

const collectionsFields = [ { field: 'speciesId' } ];
const genomeFields = [
  { field: 'speciesId',
    aggregation: () => [
      { $lookup: { from: 'genomefiles', localField: '_file', foreignField: '_id', as: 'file' } },
      { $group: { _id: { label: '$file.speciesName', key: '$speciesId' }, count: { $sum: 1 } } },
    ],
  },
];

module.exports = function (props) {
  return Promise.all([
    Species.distinct('taxId'),
    Collection.getSummary(collectionsFields, props),
    Genome.getSummary(genomeFields, props),
  ]).
  then(([ deployedSpeciesIds, collectionSummary, genomeSummary ]) => ({
    wgsaSpecies: deployedSpeciesIds.
      map(speciesId => ({
        speciesId,
        totalCollections: (collectionSummary.speciesId[speciesId] || { count: 0 }).count,
        totalGenomes: (genomeSummary.speciesId[speciesId] || { count: 0 }).count,
      })),
    otherSpecies: Object.keys(genomeSummary.speciesId).
      filter(speciesId => !(speciesId in collectionSummary.speciesId)).
      map(speciesId => ({
        speciesId,
        speciesName: genomeSummary.speciesId[speciesId].label,
        totalGenomes: genomeSummary.speciesId[speciesId].count,
      })),
  }));
};
