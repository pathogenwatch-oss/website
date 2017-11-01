const { request } = require('services/bus');

const Genome = require('models/genome');
const CollectionGenome = require('models/collectionGenome');

const formatters = require('utils/formatters');

const notifiableTasks = new Set([ 'speciator', 'mlst' ]);

function formatResult(task, version, result) {
  const format = formatters[task];
  return Object.assign(
    { __v: version },
    format ? format(result, version) : result
  );
}

module.exports = function ({ genomeId, collectionId, uploadedAt, task, version, result, clientId }) {
  const formattedResult = formatResult(task, version, result);

  if (collectionId) {
    return (
      CollectionGenome.addAnalysisResult(genomeId, task, formattedResult)
        .then(() => {
          if (typeof collectionId === 'string') {
            request('collection', 'send-progress', { collectionId });
          }
          return Promise.resolve();
        })
    );
  }

  return (
    Genome.addAnalysisResult(genomeId, task, formattedResult)
      .then(() => {
        const notification = notifiableTasks.has(task) ? formattedResult : {};
        if (clientId) {
          request('notification', 'send', {
            channel: clientId,
            topic: `analysis-${uploadedAt.toISOString()}`,
            message: { id: genomeId, task, result: notification },
          });
        }
      })
  );
};
