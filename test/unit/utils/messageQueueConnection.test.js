var assert = require('assert');
var sinon = require('sinon');
var rewire = require('rewire');

var EventEmitter = require('events').EventEmitter;

describe('Util: Message Queue Connection', function () {

  function createMockAmqpConnection(messageQueueConnection) {
    var amqpConnection = new EventEmitter();
    var amqp = messageQueueConnection.__get__('amqp');
    amqp.createConnection = sinon.stub().returns(amqpConnection);
    return amqpConnection;
  }

  it('should create the exchanges', function () {
    var messageQueueConnection = rewire('utils/messageQueueConnection');
    var EXCHANGE_CONFIG = messageQueueConnection.__get__('EXCHANGE_CONFIG');

    var amqpConnection = createMockAmqpConnection(messageQueueConnection);
    amqpConnection.exchange = sinon.spy();

    messageQueueConnection.connect(function () {
      amqpConnection.emit('ready');

      Object.keys(EXCHANGE_CONFIG).forEach(function (exchangeKey) {
        var config = EXCHANGE_CONFIG[exchangeKey];
        assert(amqpConnection.exchange.calledWith(
          config.name,
          sinon.match({ type: config.type })
        ));
      });
    });
  });

  it('should set default publish options for each exchange', function () {
    var messageQueueConnection = rewire('utils/messageQueueConnection');

    var setDefaultPublishOptions = sinon.spy();
    messageQueueConnection.__set__(
      'setDefaultPublishOptions', setDefaultPublishOptions
    );
    var amqpConnection = createMockAmqpConnection(messageQueueConnection);
    amqpConnection.exchange = sinon.stub();

    var EXCHANGE_CONFIG = messageQueueConnection.__get__('EXCHANGE_CONFIG');
    Object.keys(EXCHANGE_CONFIG).forEach(function (key, index) {
      amqpConnection.exchange.onCall(index).yields({ name: key });
    });

    messageQueueConnection.connect(function () {
      amqpConnection.emit('ready');
      assert.equal(
        setDefaultPublishOptions.callCount, Object.keys(EXCHANGE_CONFIG).length
      );
    });
  });

});
