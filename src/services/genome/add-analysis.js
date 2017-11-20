const { request } = require('services/bus');

const Genome = require('models/genome');
const CollectionGenome = require('models/collectionGenome');
const Analysis = require('models/analysis');

const notifiableTasks = new Set([ 'speciator', 'mlst' ]);

function createAnalysisUpdate(fileId, task, version) {
  const update = {
    $set: { [`analysis.${task.toLowerCase()}`]: version },
  };
  update.$pull = { pending: task };

  return new Promise((resolve) => {
    if (task === 'speciator') {
      return Analysis.findOne(
        { fileId, task, version },
        { 'results.organismId': 1, 'results.organismName': 1, 'results.speciesId': 1, 'results.speciesName': 1, 'results.genusId': 1, 'results.genusName': 1 }
      )
        .then(({ results }) => resolve(results));
    }

    if (task === 'mlst') {
      return Analysis.findOne({ fileId, task, version }, { 'results.st': 1 })
        .then(({ results }) => resolve(results));
    }

    // TODO: PAARSNP

    return resolve();
  })
  .then((patch = {}) => {
    Object.assign(update.$set, patch);
    return update;
  });
}

module.exports = function ({ genomeId, fileId, collectionId, uploadedAt, task, version, clientId }) {
  if (collectionId) {
    return CollectionGenome.update(
      { _id: genomeId },
      { [`analysis.${task.toLowerCase()}`]: version });
  }

  return createAnalysisUpdate(fileId, task, version)
    .then(update =>
      Genome.update({ _id: genomeId }, update)
        .then(() => {
          if (clientId) {
            const result = notifiableTasks.has(task) ? update.$set : null;
            request('notification', 'send', {
              channel: clientId,
              topic: `analysis-${uploadedAt.toISOString()}`,
              message: { id: genomeId, task, version, result },
            });
          }
        })
        .then(() => {
          if (task !== 'speciator') return Promise.resolve();
          const { organismId, speciesId, genusId } = update.$set;
          return request('tasks', 'submit-genome', { genomeId, fileId, uploadedAt, organismId, speciesId, genusId, clientId });
        })
    );
};
