const messageQueueService = require('services/messageQueue');

module.exports = LOGGER => ({ files, collectionId, speciesId }) => {
  for (const file of files) {
    LOGGER.info(`Submitting assembly ${file.uuid}`);

    messageQueueService.getTaskExchange().publish(`${speciesId}.all`, {
      speciesId,
      collectionId,
      assemblyId: { uuid: file.uuid, checksum: file.id },
      sequenceFile: file.path,
      taskId: `${collectionId}_${file.uuid}`,
      action: 'CREATE',
    });
  }
};
