var assert = require('assert');
var sinon = require('sinon');

describe('Service: Notification', function () {

  function createSynchronousQueue() {
    return {
      name: 'sync queue',
      subscribe(callback) {
        this.onMessage = callback;
      },
      destroy: sinon.spy(),
    };
  }

  it('should count down the expected results', function () {
    var notificationService = require('services/notification');
    var queue = createSynchronousQueue();

    var options = {
      tasks: [ 'task1', 'task2', 'task3' ],
      loggingId: 'test',
      notifyFn: sinon.stub(),
    };

    notificationService.notifyResults(queue, options);

    queue.onMessage(null, { taskType: 'task1' });
    queue.onMessage(null, { taskType: 'task3' });
    queue.onMessage(null, { taskType: 'task2' });

    assert(options.notifyFn.calledWith('task1'));
    assert(options.notifyFn.calledWith('task2'));
    assert(options.notifyFn.calledWith('task3'));

    assert(queue.destroy.called);
  });

});
