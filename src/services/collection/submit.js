const mapLimit = require('promise-map-limit');

const { request } = require('services/bus');
const { enqueue, queues } = require('../taskQueue');

const config = require('configuration');
const retries = config.tasks.retries || 3;
const timeout = config.tasks.timeout || 30;
const { name = 'tree', version = 'v1', requires = [ 'core' ] } = config.tasks.trees || {};

module.exports = ({ organismId, collectionId, uuid, collectionGenomes, uploadedAt }) => {
  mapLimit(collectionGenomes, 10, genome => {
    const { fileId, analysis } = genome;
    const { speciesId, genusId } = analysis.speciator;
    return request('tasks', 'submit-genome', {
      genomeId: genome._id,
      collectionId,
      fileId,
      uploadedAt,
      organismId,
      speciesId,
      genusId,
      clientId: uuid,
    });
  })
  .then(() => enqueue(queues.trees, {
    collectionId,
    organismId,
    uploadedAt,
    clientId: uuid,
    task: name,
    version,
    retries,
    timeout,
    requires,
  }));
};
