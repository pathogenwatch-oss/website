const async = require('async');

const storageConnection = require('utils/storageConnection');
const messageQueueConnection = require('utils/messageQueueConnection');
const logging = require('utils/logging');

const LOGGER = logging.createLogger('upload progress');
const { UPLOAD_PROGRESS } = require('utils/documentKeys');

const QUEUE_OPTIONS = { durable: true, autoDelete: false };

const Pusher = require('pusher');

async.parallel({
  storage: storageConnection.connect,
  mqConnection: messageQueueConnection.connect
}, function (connectionError, { mqConnection }) {
  if (connectionError) {
    return LOGGER.error(connectionError);
  }

  const { NOTIFICATION, SERVICES } = messageQueueConnection.getExchanges();
  const mainStorage = require('services/storage')('main');

  const pusher = new Pusher({
    appId: '179140',
    key: '8b8d274e51643f85f81a',
    secret: '7e73d132b4093f650836',
    encrypted: false,
    proxy: 'http://webcache.sanger.ac.uk:3128/'
  });

  function handleNotification(message, _, __, { queue }) {
    // messages from different sources can be different formats
    if (message.data && Buffer.isBuffer(message.data)) {
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
      function (doc, cas, done) {
        console.log(arguments);
        const { assemblyIdToNameMap } = doc;
        if (taskStatus === 'FAILURE') {
          doc.errors.push({
            assemblyName: assemblyIdToNameMap[assemblyIdString],
            taskType
          });
        }

        const numResults = doc.results[taskType] || 0;
        doc.results[taskType] = numResults + 1;

        doc.receivedResults++;

        if (doc.receivedResults === doc.expectedResults) {
          doc.status = 'READY';
          LOGGER.info(`Collection ready, destroying ${queue.name}`);
          queue.destroy();
        }

        mainStorage.store(documentKey, doc, done);

        pusher.trigger(collectionId, 'upload-progress', {
          status: doc.status,
          progress: {
            collectionId: doc.collectionId,
            collectionSize: doc.collectionSize,
            expectedResults: doc.expectedResults,
            receivedResults: doc.receivedResults,
            results: doc.results,
            errors: doc.errors,
          },
        });
      },
    ], function (error) {
      if (error) {
        return LOGGER.error(error);
      }
      queue.shift();
    });
  }

  function createNotificationQueue(collectionId, assemblyIds, callback) {
    const name = `collection-${collectionId}-notification-queue`;
    mqConnection.queue(name, QUEUE_OPTIONS, function (queue) {
      queue.bind(NOTIFICATION.name, `*.*.COLLECTION.${collectionId}`);

      // `let` is unavailable for now
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
      if (message.data && Buffer.isBuffer(message.data)) {
        message = JSON.parse(message.data.toString());
      }
      const documentKey = `${UPLOAD_PROGRESS}_${message.collectionId}`;
      const progressDocument = Object.assign({
        type: 'UP',
        documentKey,
        status: 'PROCESSING',
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
