const Collection = require('data/collection');

const logging = require('utils/logging');
const LOGGER = logging.createLogger('Collection results');

const constants = require('./constants');
const { EXPECTED_COLLECTION_RESULTS, EXPECTED_ASSEMBLY_RESULTS } = constants;

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
  return (
    Collection.update({ id }, { status: 'FATAL', statusReason: error.msg }).
      then(() => error) // propagate error
  );
}

module.exports = ({ taskType, taskStatus, assemblyId = {}, collectionId }) =>
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

      return collection.save();
    }).
    catch(error => markCollectionFatal(error, collectionId));
