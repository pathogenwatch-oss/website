/* eslint no-param-reassign: 0 */

const MessageQueue = require('mongo-message-queue');
const mQueue = new MessageQueue();
const Q = require('q');
const mongoose = require('mongoose');

const LOGGER = require('utils/logging').createLogger('queue');

const QUEUE_NAME = 'wgsa-tasks';

mQueue.processingTimeout = 5 * 60 * 1000;
mQueue.maxWorkers = 1;
mQueue.databasePromise = () => Q.resolve(mongoose.connection);

module.exports.enqueue = function (message) {
  LOGGER.info('Adding message', message);
  mQueue.enqueue(QUEUE_NAME, message)
    .catch(err => LOGGER.error(err));
};

module.exports.dequeue = function (callback) {
  mQueue.registerWorker(QUEUE_NAME, (queueItem) => {
    LOGGER.info('Handling message', queueItem);
    return callback(queueItem.message)
      .then(() => 'Completed')
      .catch(err => {
        LOGGER.error(err);
        const { retries = 1 } = queueItem.message;
        queueItem.releasedReason = err.message;
        if ((queueItem.retryCount || 0) < retries) {
          queueItem.nextReceivableTime = new Date(Date.now() + (30 * 1000));
          return 'Retry';
        }
        queueItem.rejectionReason = `Gave up after ${retries} retries.`;
        return 'Rejected';
      });
  });
};
