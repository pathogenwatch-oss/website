const path = require('path');
const WorkerNodes = require('worker-nodes');
const workers = new WorkerNodes(path.resolve(path.join(__dirname), '..', 'submit-worker.js'));

module.exports = ({ organismId, speciesId, genusId, collectionId, uuid, uploadedAt }) => {
  return workers.call({
    collectionId: collectionId.toString(),
    organismId,
    speciesId,
    genusId,
    uuid,
    uploadedAt,
  });
};
