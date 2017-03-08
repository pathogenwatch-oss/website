const messageQueueService = require('services/messageQueue');
const services = require('services');

module.exports = ({ collectionGenomes, collectionId, organismId }) => {
  for (const { uuid, genome } of collectionGenomes) {
    services.request('genome', 'file-path', genome._file.toObject()).
      then(filePath => {
        const { fileId } = genome._file;
        messageQueueService.getTaskExchange().publish(`${organismId}.all`, {
          collectionId,
          speciesId: organismId,
          assemblyId: { uuid, checksum: fileId },
          sequenceFile: filePath,
          taskId: `${collectionId}_${uuid}`,
          action: 'CREATE',
        });
      });
  }
};
