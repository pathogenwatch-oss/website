const Collection = require('../data/collection');

const mainStorage = require('services/storage')('main');
const notificationDispatcher = require('services/notificationDispatcher');

const logging = require('utils/logging');
const LOGGER = logging.createLogger('Collection results');

const EXPECTED_ASSEMBLY_RESULTS = new Set(
  require('models/assembly').ASSEMBLY_ANALYSES
);

const EXPECTED_COLLECTION_RESULTS = new Set(
  [ 'PHYLO_MATRIX', 'SUBMATRIX', 'CORE_MUTANT_TREE', 'GSL' ]
);

exports.calculateExpectedResults = function (collectionSize) {
  return (
    collectionSize * EXPECTED_ASSEMBLY_RESULTS.size +
    EXPECTED_COLLECTION_RESULTS.size
  );
};

function resultIsNotADuplicate(taskType, numResults, size) {
  if (EXPECTED_COLLECTION_RESULTS.has(taskType)) {
    return numResults === 0;
  }

  if (EXPECTED_ASSEMBLY_RESULTS.has(taskType)) {
    return numResults < size;
  }

  return true; // result is not a duplicate
}

const fatalTasks = new Set([ 'UPLOAD', 'CORE' ]);

const fatalTasksHaveCompleted = (collectionSize, results) =>
  Array.from(fatalTasks).every(task => results[task] === collectionSize);

const hasFatalErrors = errors =>
  errors.some(({ taskType }) => fatalTasks.has(taskType));

function isCollectionFatal({ collectionSize, results, errors }) {
  if (fatalTasksHaveCompleted(collectionSize, results)) {
    return hasFatalErrors(errors);
  }
  return false;
}

function markCollectionFatal(id, error) {
  return Collection.update({ id }, { status: 'FATAL', statusReason: error.msg });
}

const recordProgress =
  ({ taskType, taskStatus, assemblyId = {}, collectionId }) =>
    Collection.findById(collectionId).
      then(collection => {
        const { submission } = collection;
        const numResultsForTask = submission.results[taskType] || 0;

        if (resultIsNotADuplicate(taskType, numResultsForTask, collection.size)) {
          submission.results[taskType] += numResultsForTask + 1;
          submission.totalResultsReceived++;
        } else {
          LOGGER.warn(`${taskType} is a duplicate, ignoring.`);
          return null;
        }

        if (taskStatus !== 'SUCCESS') {
          submission.errors.push({
            assemblyName: assemblyId.uuid, // TODO: Fetch assembly name
            taskType,
          });
        }

        if (isCollectionFatal(collection)) {
          collection.status = 'FATAL';
          submission.ended = new Date();
          LOGGER.info('Collection fatal :(');
        } else if (submission.isComplete()) {
          collection.status = 'READY';
          submission.ended = new Date();
          LOGGER.info('Collection ready!');
        }

        notificationDispatcher.publishNotification(collectionId, 'submission-progress', {
          status: collection.status,
          progress: {
            collectionId: collection.id,
            collectionSize: collection.size,
            expectedResults: submission.totalResultsExpected,
            receivedResults: submission.totalResultsReceived,
            results: submission.results,
            errors: submission.errors,
          },
        });

        return collection.save();
      });

exports.handleResult = function (message) {
  const { taskType, taskStatus, assemblyId = {}, collectionId } = message;
  const assemblyIdString = assemblyId.uuid || 'N/A';

  LOGGER.info(`Processing message:
Tasktype: ${taskType}
Status: ${taskStatus}
Assembly Id: ${assemblyIdString}
Collection: ${collectionId}`);

  return (
    aggregateResult(message).
      then(() => recordProgress(message)).
      catch(error => markCollectionFatal(collectionId, error))
  );
};
