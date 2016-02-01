const async = require('async');

const storageConnection = require('utils/storageConnection');
const messageQueueConnection = require('utils/messageQueueConnection');
const logging = require('utils/logging');

const LOGGER = logging.createLogger('upload progress');

async.parallel({
  storage: storageConnection.connect,
  mqConnection: messageQueueConnection.connect
}, function (error, { mqConnection }) {
  if (error) {
    return LOGGER.error(error);
  }

  const { NOTIFICATION } = messageQueueConnection.getExchanges();
  const mainStorage = require('services/storage')('main');

  mqConnection.queue(`upload-progress-queue`, {}, function (queue) {
    LOGGER.info(`${queue.name} is open.`);
    queue.bind(NOTIFICATION.name, '#');

    queue.subscribe({ ack: true }, function (message) {
      const { taskType, taskStatus, assemblyId, collectionId } =
        JSON.parse(message.data.toString());

      const documentKey = `UP_${collectionId}`;
      const assemblyIdString = assemblyId.assemblyId || 'N/A';

      LOGGER.info(`Processing message:
  Tasktype: ${taskType},
  Status: ${taskStatus}
  Assembly Id: ${assemblyIdString}
  Collection: ${collectionId}`);

      async.waterfall([
        mainStorage.retrieve.bind(null, documentKey),
        function (result, done) {
          const doc = JSON.parse(result);

          if (LOGGER.taskType === 'ERROR') {
            doc.errors.push({ assemblyId: assemblyIdString, taskType });
          } else {
            const numResults = doc.results[taskType] || 0;
            doc.results[taskType] = numResults + 1;
          }
          done(null, doc);
        },
        mainStorage.store.bind(null, documentKey)
      ], function (documentError) {
        if (documentError) {
          LOGGER.error(documentError);
        }
        queue.shift();
      });
    });
  });
});
