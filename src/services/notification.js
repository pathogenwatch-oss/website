var LOGGER = require('utils/logging').createLogger('Message Queue');

function notifyResults(queue, options) {
  var tasks = options.tasks;
  var loggingId = options.loggingId;
  var notifyFn = options.notifyFn;

  var expectedResults = tasks.map(function (task) { return task; });

  queue.subscribe(function (error, message) {
    var taskType;

    if (error) {
      return LOGGER.error(error);
    }

    taskType = message.taskType;
    if (expectedResults.indexOf(taskType) === -1) {
      return LOGGER.warn('Skipping task: ' + taskType);
    }

    LOGGER.info('Received notification for ' + loggingId + ': ' + taskType);

    notifyFn(taskType);
    expectedResults.splice(message.taskType, 1);

    LOGGER.info('Remaining tasks for ' + loggingId + ': ' + expectedResults);

    if (expectedResults.length === 0) {
      LOGGER.info(loggingId + ' tasks completed, destroying ' + queue.name);
      queue.destroy();
    }
  });
}

module.exports.notifyResults = notifyResults;
