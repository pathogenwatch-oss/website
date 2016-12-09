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

function isCollectionFatal({ size, progress }) {
  if (fatalTasksHaveCompleted(size, progress.results)) {
    return hasFatalErrors(progress.errors);
  }
  return false;
}

function isCollectionComplete({ progress }) {
  return progress.totalResultsReceived === progress.totalResultsExpected;
}

function markCollectionFatal(id, error) {
  return (
    Collection.update({ id }, { status: 'FATAL', statusReason: error.msg }).
      then(() => error) // propagate error
  );
}

module.exports = ({ taskType, taskStatus, assemblyId = {}, collectionId }) =>
  Collection.findOne({ uuid: collectionId }).
    then(collection => {
      try {
        const { progress } = collection;
        const numResultsForTask = progress.results[taskType] || 0;

        if (resultIsNotADuplicate(taskType, numResultsForTask, collection.size)) {
          progress.results[taskType] += numResultsForTask + 1;
          progress.totalResultsReceived++;
        } else {
          LOGGER.warn(`${taskType} is a duplicate, ignoring.`);
          return collection;
        }

        if (taskStatus !== 'SUCCESS') {
          progress.errors.push({
            assemblyName: assemblyId.uuid, // TODO: Fetch assembly name
            taskType,
          });
        }

        if (isCollectionFatal(collection)) {
          collection.status = 'FATAL';
          progress.completed = new Date();
          LOGGER.info('Collection fatal :(');
        } else if (isCollectionComplete(collection)) {
          collection.status = 'READY';
          progress.completed = new Date();
          LOGGER.info('Collection ready!');
        }

        return collection.save();
      } catch (error) {
        LOGGER.error(error);
        return error;
      }
    }).
    catch(error => markCollectionFatal(error, collectionId));
