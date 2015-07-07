var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');

var EventEmitter = require('events').EventEmitter;

describe('Util: Socket Connection', function () {

  it('should make socket connections respond to room requests',
    function (done) {
      var socketConnectionUtil = rewire('utils/socketConnection');

      var ROOM_ID = '123';
      var newRoomId = sinon.stub().returns(ROOM_ID);
      socketConnectionUtil.__set__('newRoomId', newRoomId);

      var socket = new EventEmitter();
      socket.handshake = { headers: { host: 'localhost' } };
      socket.join = sinon.spy();

      socketConnectionUtil.initialise(socket);

      socket.on('roomId', function (roomId) {
        assert(newRoomId.called);
        assert(socket.join.calledWith(ROOM_ID));
        assert.equal(roomId, ROOM_ID);
        done();
      });

      socket.emit('getRoomId');
    }
  );

});
