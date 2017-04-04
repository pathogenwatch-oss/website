/* eslint no-param-reassign: 0 */

const MessageQueue = require('mongo-message-queue');
const mQueue = new MessageQueue();

const LOGGER = require('utils/logging').createLogger('queue');

const QUEUE_NAME = 'wgsa-tasks';

module.exports.enqueue = function (message) {
  LOGGER.info('Adding message', message);
  mQueue.enqueue(QUEUE_NAME, message);
};

module.exports.dequeue = function (callback) {
  mQueue.registerWorker(QUEUE_NAME, (queueItem) => {
    LOGGER.info('Handling message', queueItem);
    return callback(queueItem)
      .then(() => 'Completed')
      .catch(err => {
        queueItem.releasedReason = err.message;
        if ((queueItem.retryCount || 0) < 5) {
          queueItem.nextReceivableTime = new Date(Date.now() + (30 * 1000));
          return 'Retry';
        }
        queueItem.rejectionReason = 'Gave up after 5 retries.';
        return 'Rejected';
      });
  });
};
