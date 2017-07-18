const messageQueueService = require('services/messageQueue');
const services = require('services');

module.exports = ({ organismId, collectionId, uuidToGenome }) => {
  for (const [ uuid, genome ] of uuidToGenome) {
    services.request('genome', 'file-path', genome.fileId).
      then(filePath => {
        const { fileId } = genome;
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
