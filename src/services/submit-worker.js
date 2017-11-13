const mapLimit = require('promise-map-limit');

const { ObjectID } = require('bson');

const mongoConnection = require('utils/mongoConnection');
const CollectionGenome = require('models/collectionGenome');

const { request } = require('services');
const { enqueue, queues } = require('./taskQueue');

const { getTreesTask } = require('../manifest');

function getCollectionGenomes(_collection) {
  return CollectionGenome.find({ _collection }, { fileId: 1 });
}

mongoConnection.connect();

module.exports = ({ collectionId, organismId, speciesId, genusId, uuid, uploadedAt }) => {
  const id = new ObjectID(collectionId);
  Promise.resolve(id)
    .then(getCollectionGenomes)
    .then(collectionGenomes =>
      mapLimit(collectionGenomes, 10, genome => {
        const { _id, fileId } = genome;
        return request('tasks', 'submit-genome', {
          genomeId: _id,
          collectionId: id,
          fileId,
          uploadedAt,
          organismId,
          speciesId,
          genusId,
          clientId: uuid,
        });
      })
    )
    .then(() => {
      const { task, version, requires } = getTreesTask();
      return enqueue(queues.trees, {
        collectionId: id,
        organismId,
        uploadedAt,
        clientId: uuid,
        task,
        version,
        requires,
      });
    });
};
