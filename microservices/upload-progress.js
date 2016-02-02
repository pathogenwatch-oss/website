const async = require('async');

const storageConnection = require('utils/storageConnection');
const messageQueueConnection = require('utils/messageQueueConnection');
const logging = require('utils/logging');

const LOGGER = logging.createLogger('upload progress');
const { UPLOAD_PROGRESS } = require('utils/documentKeys');

async.parallel({
  storage: storageConnection.connect,
  mqConnection: messageQueueConnection.connect
}, function (error, { mqConnection }) {
  if (error) {
    return LOGGER.error(error);
  }

  const { NOTIFICATION, SERVICES } = messageQueueConnection.getExchanges();
  const mainStorage = require('services/storage')('main');

  function handleNotification(message) {
    const { taskType, taskStatus, assemblyId = {}, collectionId } =
      JSON.parse(message.data.toString());

    const documentKey = `${UPLOAD_PROGRESS}_${collectionId}`;
    const assemblyIdString = assemblyId.assemblyId || 'N/A';

    LOGGER.info(`Processing message:
Tasktype: ${taskType}
Status: ${taskStatus}
Assembly Id: ${assemblyIdString}
Collection: ${collectionId}`);

    let isComplete = false;
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

        doc.receivedResults++;

        if (doc.receivedResults >== doc.expectedResults) {
          isComplete = true;
        }

        done(null, doc);
      },
      mainStorage.store.bind(null, documentKey)
    ], function (documentError) {
      if (documentError) {
        return LOGGER.error(documentError);
      }
      if (isComplete) {
        LOGGER.info(`Upload complete, destroying ${this.name}`);
        return this.destroy();
      }
      this.shift();
    });
  }

  function createNotificationQueue(collectionId, assemblyIds, callback) {
    const name = `collection-${collectionId}-notification-queue`;
    mqConnection.queue(name, {}, function (queue) {
      queue.bind(NOTIFICATION.name, `*.*.COLLECTION.${collectionId}`);
      for (const assemblyId of assemblyIds) {
        queue.bind(NOTIFICATION.name, `*.*.ASSEMBLY.${assemblyId}`);
      }

      queue.subscribe({ ack: true }, handleNotification.bind(queue));

      LOGGER.info(`Opened queue ${name}`);
      callback();
    });
  }

  mqConnection.queue(`upload-progress-queue`, {}, function (queue) {
    LOGGER.info(`${queue.name} is open.`);
    queue.bind(SERVICES.name, 'upload-progress');

    queue.subscribe({ ack: true, prefetchCount: 0 },
      (message, headers, deliveryInfo, ack) => {
        const data = JSON.parse(message.data.toString());

        const documentKey = `${UPLOAD_PROGRESS}_${data.collectionId}`;
        const progressDocument = Object.assign({
          type: 'UP',
          documentKey,
          receivedResults: 0,
          results: {},
          errors: []
        }, data);

        async.parallel([
          (done) => mainStorage.store(
            documentKey,
            progressDocument,
            done
          ),
          (done) => createNotificationQueue(
            data.collectionId, Object.keys(data.assemblyIdToNameMap), done
          )
        ], function () {
          ack.acknowledge();
        });
      }
    );
  });
});
