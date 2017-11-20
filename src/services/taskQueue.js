/* eslint no-param-reassign: 0 */

const MessageQueue = require('mongo-message-queue');
const mQueue = new MessageQueue();
const Q = require('q');
const mongoose = require('mongoose');

const config = require('configuration');
const LOGGER = require('utils/logging').createLogger('queue');

const defaultRetries = config.tasks.retries || 3;
const timeout = config.tasks.timeout || 30;

mQueue.processingTimeout = (timeout || 60) * 1000;
mQueue.maxWorkers = 1;

mQueue.databasePromise = () => Q.resolve(mongoose.connection);

module.exports.setMaxWorkers = function (max = 1) {
  mQueue.maxWorkers = max;
};

const queues = {
  tasks: 'tasks',
  speciator: 'speciator',
  trees: 'trees',
};


module.exports.queues = queues;

module.exports.enqueue = function (queue, message) {
  if (!(queue in queues)) {
    LOGGER.error(`Queue ${queue} not recognised.`);
    throw new Error(`Queue ${queue} not recognised.`);
  }
  LOGGER.info('Adding message', message, 'to', queue);
  return (
    mQueue.enqueue(queue, Object.assign({ retries: defaultRetries, timeout }, message))
      .catch(err => LOGGER.error(err))
  );
};

module.exports.dequeue = function (queue, callback, reject) {
  mQueue.registerWorker(queue, (queueItem) => {
    LOGGER.info('Handling message', queueItem, 'from', queue);
    return callback(queueItem.message)
      .then(() => 'Completed')
      .catch(err => {
        LOGGER.error(err);
        const { retries = 1 } = queueItem.message;
        queueItem.releasedReason = err.message;
        if ((queueItem.retryCount || 0) < retries - 1) {
          queueItem.nextReceivableTime = new Date(Date.now() + (30 * 1000));
          return 'Retry';
        }
        queueItem.rejectionReason = `Gave up after ${retries} retries.`;
        if (reject) reject(queueItem.message);
        return 'Rejected';
      });
  });
};
