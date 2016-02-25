const async = require('async');

const notificationDispatcher = require('services/notificationDispatcher');

const messageQueueUtil = require('utils/messageQueueConnection');
const logging = require('utils/logging');

const LOGGER = logging.createLogger('upload progress');
const { COLLECTION_METADATA } = require('utils/documentKeys');

const QUEUE_OPTIONS = { durable: true, autoDelete: false };

const EXPECTED_ASSEMBLY_RESULTS = new Set(
  require('models/assembly').ASSEMBLY_ANALYSES.concat([ 'UPLOAD', 'GSL' ])
);

const EXPECTED_COLLECTION_RESULTS = new Set(
  [ 'PHYLO_MATRIX', 'SUBMATRIX', 'CORE_MUTANT_TREE' ]
);

const EXPECTED_RESULTS = new Set(
  [ ...EXPECTED_ASSEMBLY_RESULTS, ...EXPECTED_COLLECTION_RESULTS ]
);

function calculateExpectedResults({ collectionSize }) {
  return (
    collectionSize * EXPECTED_ASSEMBLY_RESULTS.size +
    EXPECTED_COLLECTION_RESULTS.size
  );
}

function resultIsExpected(taskType, numResults, collectionSize) {
  if (EXPECTED_COLLECTION_RESULTS.has(taskType)) {
    return numResults === 0;
  }

  if (EXPECTED_ASSEMBLY_RESULTS.has(taskType)) {
    return numResults < collectionSize;
  }

  return false;
}

const fatalTasks = new Set([ 'UPLOAD', 'CORE' ]);
function isCollectionFatal({ collectionSize, results, errors }) {
  // allows error page to show all failed assemblies
  if (Array.from(fatalTasks).every(task => results[task] === collectionSize)) {
    return errors.some(({ taskType }) => fatalTasks.has(taskType));
  }
  return false;
}

module.exports = function ({ mqConnection }) {
  const { NOTIFICATION, SERVICES } = messageQueueUtil.getExchanges();
  const mainStorage = require('services/storage')('main');

  function handleNotification(message, _, __, { queue }) {
    // messages from different sources can be different formats
    if (message.data && Buffer.isBuffer(message.data)) {
      message = JSON.parse(message.data.toString());
    }

    const { taskType, taskStatus, assemblyId = {}, collectionId } = message;

    const documentKey = `${COLLECTION_METADATA}_${collectionId}`;
    const assemblyIdString = assemblyId.assemblyId || 'N/A';

    LOGGER.info(`Processing message:
Tasktype: ${taskType}
Status: ${taskStatus}
Assembly Id: ${assemblyIdString}
Collection: ${collectionId}`);

    if (!EXPECTED_RESULTS.has(taskType)) {
      LOGGER.warn(`${taskType} is not an expected result, discarding.`);
      return queue.shift();
    }

    async.waterfall([
      done => mainStorage.retrieve(documentKey, done),
      function (doc, cas, done) {
        const { assemblyIdToNameMap, collectionSize } = doc;
        if (taskStatus !== 'SUCCESS') {
          doc.errors.push({
            assemblyName: assemblyIdToNameMap[assemblyIdString],
            taskType
          });
        }

        const numResults = doc.results[taskType] || 0;

        if (resultIsExpected(taskType, numResults, collectionSize)) {
          doc.results[taskType] = numResults + 1;
          doc.receivedResults++;
        } else {
          LOGGER.warn(`${taskType} is a duplicate, ignoring.`);
          return done();
        }

        if (isCollectionFatal(doc)) {
          doc.status = 'FATAL';
          doc.uploadEnded = new Date();
          LOGGER.info(`Collection fatal, destroying ${queue.name}`);
          queue.destroy();
        }

        if (doc.receivedResults === doc.expectedResults) {
          doc.status = 'READY';
          doc.uploadEnded = new Date();
          LOGGER.info(`Collection ready, destroying ${queue.name}`);
          queue.destroy();
        }

        mainStorage.store(documentKey, doc, done);

        notificationDispatcher.publishNotification(collectionId, 'upload-progress', {
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
      const documentKey = `${COLLECTION_METADATA}_${message.collectionId}`;
      const progressDocument = Object.assign({
        type: `${COLLECTION_METADATA}`,
        documentKey,
        uploadStarted: new Date(),
        status: 'PROCESSING',
        expectedResults: calculateExpectedResults(message),
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
};
