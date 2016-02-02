const async = require('async');

const storageConnection = require('utils/storageConnection');
const messageQueueConnection = require('utils/messageQueueConnection');
const logging = require('utils/logging');

const LOGGER = logging.createLogger('upload progress');
const { UPLOAD_PROGRESS } = require('utils/documentKeys');

const QUEUE_OPTIONS = { durable: true, autoDelete: false };

async.parallel({
  storage: storageConnection.connect,
  mqConnection: messageQueueConnection.connect
}, function (error, { mqConnection }) {
  if (error) {
    return LOGGER.error(error);
  }

  const { NOTIFICATION, SERVICES } = messageQueueConnection.getExchanges();
  const mainStorage = require('services/storage')('main');

  function handleNotification(message, _, __, { queue }) {
    const { taskType, taskStatus, assemblyId = {}, collectionId } =
      JSON.parse(message.data.toString());

    const documentKey = `${UPLOAD_PROGRESS}_${collectionId}`;
    const assemblyIdString = assemblyId.assemblyId || 'N/A';

    LOGGER.info(`Processing message:
Tasktype: ${taskType}
Status: ${taskStatus}
Assembly Id: ${assemblyIdString}
Collection: ${collectionId}`);

    async.waterfall([
      (done) => mainStorage.retrieve(documentKey, done),
      function (doc, done) {
        if (taskStatus === 'ERROR') {
          doc.errors.push({ assemblyId: assemblyIdString, taskType });
        }

        const numResults = doc.results[taskType] || 0;
        doc.results[taskType] = numResults + 1;

        doc.receivedResults++;

        mainStorage.store(documentKey, doc, function (storageError) {
          done(storageError, (doc.receivedResults === doc.expectedResults));
        });
      },
    ], function (documentError, isComplete) {
      if (documentError) {
        return LOGGER.error(documentError);
      }
      if (isComplete) {
        LOGGER.info(`Upload complete, destroying ${queue.name}`);
        return queue.destroy();
      }
      queue.shift();
    });
  }

  function createNotificationQueue(collectionId, assemblyIds, callback) {
    const name = `collection-${collectionId}-notification-queue`;
    mqConnection.queue(name, QUEUE_OPTIONS, function (queue) {
      queue.bind(NOTIFICATION.name, `*.*.COLLECTION.${collectionId}`);

      for (var assemblyId of assemblyIds) {
        queue.bind(NOTIFICATION.name, `*.*.ASSEMBLY.${assemblyId}`);
      }

      queue.subscribe({ ack: true }, handleNotification);

      LOGGER.info(`Opened queue ${name}`);
      callback();
    });
  }

  mqConnection.queue(`upload-progress-queue`, QUEUE_OPTIONS, function (queue) {
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
