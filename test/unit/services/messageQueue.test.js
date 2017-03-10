var assert = require('assert');
var sinon = require('sinon');
var rewire = require('rewire');

var EventEmitter = require('events').EventEmitter;

describe('Service: Message Queue', function () {

  var NOTIFICATION_EXCHANGE_NAME = 'notificationExchange';

  function mockConnectionQueue(messageQueueService, mockQueue) {
    messageQueueService.__set__({
      exchanges: {
        NOTIFICATION: {
          name: NOTIFICATION_EXCHANGE_NAME,
        },
      },
      connection: {
        queue: sinon.stub().yields(mockQueue),
      },
    });
  }

  var MESSAGE_EVENT = 'message';
  function createEventEmittingQueue(eventName) {
    var queue = new EventEmitter();
    queue.subscribe = queue.on.bind(queue, eventName || MESSAGE_EVENT);
    queue.bind = function () {};
    return queue;
  }

  describe('Feature: Assembly Notification Queue', function () {

    it('should bind to the correct messages', function (done) {
      var messageQueueService = rewire('services/messageQueue');

      var queueSpy = { bind: sinon.spy(), subscribe: sinon.spy() };
      mockConnectionQueue(messageQueueService, queueSpy);

      var NOTIFICATION_IDS = {
        assemblyId: 'assembly1',
        collectionId: 'collection1',
        organismId: '1280',
      };
      messageQueueService.newAssemblyNotificationQueue(
        NOTIFICATION_IDS, {
          tasks: [],
          loggingId: 'Assembly',
          notifyFn() {},
        }, function (queue) {
          assert(queue.bind.calledWith(
            NOTIFICATION_EXCHANGE_NAME,
            NOTIFICATION_IDS.organismId + '.*.ASSEMBLY.' + NOTIFICATION_IDS.assemblyId
          ));

          done();
        }
      );
    });

    it('should parse messages as JSON', function (done) {
      var messageQueueService = rewire('services/messageQueue');

      var queue = createEventEmittingQueue();
      mockConnectionQueue(messageQueueService, queue);

      var NOTIFICATION_IDS = {};
      var MESSAGE = { hello: 'world' };
      messageQueueService.newAssemblyNotificationQueue(
        NOTIFICATION_IDS, {
          tasks: [],
          loggingId: 'Assembly',
          notifyFn() {},
        }, function (queue) {
          queue.subscribe(function (error, message) {
            assert(error === null);
            assert(sinon.match(message, MESSAGE));
            done();
          });
          queue.emit(MESSAGE_EVENT, { data: JSON.stringify(MESSAGE) });
        }
      );
    });

    it('should surface JSON parsing errors', function (done) {
      var messageQueueService = rewire('services/messageQueue');

      var queue = createEventEmittingQueue();
      mockConnectionQueue(messageQueueService, queue);

      var NOTIFICATION_IDS = {};
      var INVALID_JSON = '{ hello: world }';
      messageQueueService.newAssemblyNotificationQueue(
        NOTIFICATION_IDS, {
          tasks: [],
          loggingId: 'Assembly',
          notifyFn() {},
        }, function (queue) {
          queue.subscribe(function (error, value) {
            assert(error);
            assert(!value);
            done();
          });
          queue.emit(MESSAGE_EVENT, { data: INVALID_JSON });
        }
      );
    });

  });

});
