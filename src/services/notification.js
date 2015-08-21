var LOGGER = require('utils/logging').createLogger('Notification');

function notifyResults(queue, options) {
  var tasks = options.tasks;
  var loggingId = options.loggingId;
  var notifyFn = options.notifyFn;

  var expectedResults = tasks.map(function (task) { return task; });

  queue.subscribe(function (error, message) {
    var taskType;
    var taskIndex;

    if (error) {
      return LOGGER.error(error);
    }

    taskType = message.taskType;
    taskIndex = expectedResults.indexOf(taskType);

    if (taskIndex === -1) {
      return LOGGER.warn('Skipping task: ' + taskType);
    }

    LOGGER.info('Received notification for ' + loggingId + ': ' + taskType);

    notifyFn(taskType);
    expectedResults.splice(taskIndex, 1);

    LOGGER.info('Remaining tasks for ' + loggingId + ': ' + expectedResults);

    if (expectedResults.length === 0) {
      LOGGER.info(loggingId + ' tasks completed, destroying ' + queue.name);
      queue.destroy();
    }
  });
}

module.exports.notifyResults = notifyResults;
