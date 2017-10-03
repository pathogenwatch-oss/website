const mongoConnection = require('utils/mongoConnection');

require('services');
const Organism = require('models/organism');
const Genome = require('models/genome');
const CollectionGenome = require('models/collectionGenome');

function fetchOrganismRecords() {
  return Promise.all([
    Organism.getLatest('1280'),
    Organism.getLatest('90370'),
    Organism.getLatest('485'),
  ]);
}

function formatAnalysis(reference, genome) {
  return new Promise(resolve => {
    for (const key of Object.keys(reference.analysis)) {
      const result = genome.analysis[key];
      if (!result) continue;
      if (key in CollectionGenome.formatters) {
        reference.analysis[key] = CollectionGenome.formatters[key](result);
      } else {
        reference.analysis[key] = result;
      }
    }
    delete reference.metrics;
    resolve(reference);
  });
}

function copyAnalysis(organisms) {
  return Promise.all(organisms.map(({ taxId, tree, resistance, references }) =>
    Promise.all(references.map(reference =>
      Genome.findOne({
        reference: true,
        organismId: taxId,
        fileId: reference.fileId,
      })
      .lean()
      .then(genome => formatAnalysis(reference, genome))
    ))
    .then(patchedReferences =>
      Organism.create({
        taxId,
        tree,
        resistance,
        references: patchedReferences,
        deployed: new Date(),
      })
    )
  ));
}

mongoConnection.connect()
  .then(fetchOrganismRecords)
  .then(copyAnalysis)
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
