const mongoConnection = require('utils/mongoConnection');
const Queue = require('models/queue');
const assert = require('assert').strict;

let timeNow = 0;
Queue.overideNow(() => timeNow);
const testQueue = 'testQueue'

describe("Queue", async function() {
  before(async function() {
    await mongoConnection.connect()
  })

  beforeEach(async function() {
    timeNow = 0;
    await Queue.deleteMany({ queue: testQueue });
    for (let i = 0; i < 5; i++) {
      await Queue.enqueue(
        { 
          task: 'test',
          version: 0,
          taskType: 'testTask',
          timeout: 10,
          resources: { cpu: 1, memory: (100 - i) * 1024**2 },
          retries: 3,
        },
        { testNumber: i },
        testQueue
      )
    }
  })

  it("should put requeue if not-acked", async function(done) {
    assert.equal(await Queue.queueLength({}, {}, testQueue), 5)
    
    // Take a job but don't ack it in time
    const job = await Queue.dequeue({}, {}, testQueue)
    assert.equal(await Queue.queueLength({}, {}, testQueue), 4)
    timeNow += Queue.ackWindow + 1
    const anotherWorkerJob = await Queue.dequeue({}, {}, testQueue)
    let ackOk = await Queue.ack(job);
    assert.ok(!ackOk);
    assert.equal(job._id.toString(), anotherWorkerJob._id.toString())

    // Acking the job works
    timeNow += 5
    assert.ok(await Queue.ack(anotherWorkerJob));
    timeNow += 5;
    assert.ok(await Queue.handleSuccess(anotherWorkerJob));
    assert.equal(await Queue.queueLength({}, {}, testQueue), 4);
    done()
  })

  it("should requeue a job which times out", async function(done) {
    try {
      // Worker doesn't complete a job before the timeout
      timeNow += 5;
      const job = await Queue.dequeue({}, {}, testQueue)
      await Queue.ack(job)
      assert.equal(await Queue.queueLength({}, {}, testQueue), 4);
      timeNow += job.message.spec.timeout + 1;
      assert.equal(await Queue.queueLength({}, {}, testQueue), 5);
      
      // Another worker gets the same job
      const anotherWorkerJob = await Queue.dequeue({}, {}, testQueue)
      assert.equal(job._id.toString(), anotherWorkerJob._id.toString())
      assert.ok(await Queue.ack(anotherWorkerJob));
      assert.ok(await Queue.handleSuccess(anotherWorkerJob));
      assert.ok(!await Queue.handleSuccess(job));
      done();
    } catch (err) {
      done(err)
    }
  })

  it("should retry jobs which fail", async function(done) {
    try {
      assert.equal(await Queue.queueLength({}, {}, testQueue), 5)
    
      // Take a job but fail
      const job = await Queue.dequeue({}, {}, testQueue)
      assert.ok(await Queue.ack(job));
      assert.equal(job.message.spec.timeout, 10)
      assert.ok(await Queue.handleFailure(job, 'testReason'));
  
      // Get the same job again
      timeNow += 11;
      let anotherWorkerJob = await Queue.dequeue({}, {}, testQueue)
      assert.ok(await Queue.ack(anotherWorkerJob));
      assert.equal(job._id.toString(), anotherWorkerJob._id.toString())
      assert.equal(anotherWorkerJob.message.spec.timeout, 20)
      assert.ok(await Queue.handleFailure(anotherWorkerJob, 'testReason'));
      
      // Get the same job again
      timeNow += 11;
      anotherWorkerJob = await Queue.dequeue({}, {}, testQueue)
      assert.ok(await Queue.ack(anotherWorkerJob));
      assert.equal(job._id.toString(), anotherWorkerJob._id.toString())
      assert.equal(anotherWorkerJob.message.spec.timeout, 40)
      assert.ok(!await Queue.handleFailure(anotherWorkerJob, 'testReason'));
  
      // Get a different job
      timeNow += 11;
      anotherWorkerJob = await Queue.dequeue({}, {}, testQueue)
      assert.ok(await Queue.ack(anotherWorkerJob));
      assert.notEqual(job._id.toString(), anotherWorkerJob._id.toString())
      assert.ok(await Queue.handleSuccess(anotherWorkerJob, 'testReason'));
      
      done()
    } catch (err) {
      done(err)
    }
  })

  after(async function() {
    await mongoConnection.close()
  })
})