const argv = require('named-argv');

const Collection = require('models/collection');
const CollectionGenome = require('models/collectionGenome');
const messageQueueUtil = require('utils/messageQueueConnection');

const {
  collectionId,
  task,
  action,
} = argv.opts;

console.log({ collectionId, task, action });

if (!collectionId || !task || !action) {
  console.log('Missing arguments');
  process.exit(1);
}

function getFilePath([ first, second, ...rest ]) {
  return `/nfs/wgst/fasta-store/${first}${second}/${rest.join('')}`;
}

module.exports = function () {
  const { TASK } = messageQueueUtil.getExchanges();
  return (
    Collection.findByUuid(collectionId)
      .then(collection =>
        Promise.all([
          Promise.resolve(collection),
          CollectionGenome.find({ _collection: collection.id }),
        ])
      )
      .then(([ { organismId }, genomes ]) =>
        Promise.all(
          genomes.map(({ uuid, fileId }) =>
            TASK.publish(`${organismId}.${task}`, {
              speciesId: organismId,
              collectionId,
              assemblyId: { uuid, checksum: fileId },
              sequenceFile: getFilePath(fileId),
              taskId: `${collectionId}-${uuid}`,
              action,
            })
          )
        )
      )
      .then(() => process.exit(0))
  );
};
