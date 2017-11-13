const mapLimit = require('promise-map-limit');

const { request } = require('services/bus');
const { enqueue, queues } = require('../taskQueue');

const { getTreesTask } = require('../../manifest');

module.exports = ({ organismId, collectionId, uuid, collectionGenomes, uploadedAt }) => {
  const { task, version, requires } = getTreesTask();

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
    task,
    version,
    requires,
  }));
};
