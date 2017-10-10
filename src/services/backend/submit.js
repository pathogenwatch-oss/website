const messageQueueService = require('services/messageQueue');
const services = require('services');

module.exports = ({ organismId, collectionId, uuidToGenome }) => {
  for (const [ uuid, genome ] of uuidToGenome) {
    const { fileId } = genome;
    services.request('genome', 'file-path', { fileId }).
      then(filePath => {
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
