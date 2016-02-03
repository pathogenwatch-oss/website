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
}, function (connectionError, { mqConnection }) {
  if (connectionError) {
    return LOGGER.error(connectionError);
  }

  const { NOTIFICATION, SERVICES } = messageQueueConnection.getExchanges();
  const mainStorage = require('services/storage')('main');

  function handleNotification(message, _, __, { queue }) {
    if (message.data && Buffer.isBuffer(message.data)){
      message = JSON.parse(message.data.toString());
    }
    const { taskType, taskStatus, assemblyId = {}, collectionId } = message;
    const documentKey = `${UPLOAD_PROGRESS}_${collectionId}`;
    const assemblyIdString = assemblyId.assemblyId || 'N/A';

    LOGGER.info(`Processing message:
Tasktype: ${taskType}
Status: ${taskStatus}
Assembly Id: ${assemblyIdString}
Collection: ${collectionId}`);

    async.waterfall([
      done => mainStorage.retrieve(documentKey, done),
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
    ], function (error, isComplete) {
      if (error) {
        return LOGGER.error(error);
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

    queue.subscribe(message => {
      const documentKey = `${UPLOAD_PROGRESS}_${message.collectionId}`;
      const progressDocument = Object.assign({
        type: 'UP',
        documentKey,
        receivedResults: 0,
        results: {},
        errors: []
      }, message);

      async.parallel([
        done => mainStorage.store(
          documentKey,
          progressDocument,
          done
        ),
        done => createNotificationQueue(
          message.collectionId, Object.keys(message.assemblyIdToNameMap), done
        )
      ], error => mqConnection.exchange().publish(
          `upload-progress-request-${message.collectionId}`, { error }
        )
      );
    });
  });
});
