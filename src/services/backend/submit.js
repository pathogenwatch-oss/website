const messageQueueService = require('services/messageQueue');
const services = require('services');

module.exports = LOGGER => ({ collectionGenomes, collectionId, speciesId }) => {
  for (const { uuid, genome } of collectionGenomes) {
    services.request('genome', 'file-path', genome._file.toObject()).
      then(filePath => {
        const { fileId } = genome._file;
        LOGGER.info(`Submitting assembly ${uuid}`);
        messageQueueService.getTaskExchange().publish(`${speciesId}.all`, {
          speciesId,
          collectionId,
          assemblyId: { uuid, checksum: fileId },
          sequenceFile: filePath,
          taskId: `${collectionId}_${uuid}`,
          action: 'CREATE',
        });
      });
  }
};
