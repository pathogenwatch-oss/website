/* eslint-disable no-undef */
const mongoConnection = require('utils/mongoConnection');
const mongoose = require('mongoose');
const Queue = require('models/queue');
const assert = require('assert').strict;

let timeNow = 0;
Queue.overrideNow(() => timeNow);
const userId = mongoose.Types.ObjectId('602ba05d24a87083dab20204');
const altUserId = mongoose.Types.ObjectId('602ba05d24a87083dab20203');

const testQueue = 'testQueue';
describe("Queue", async () => {
  before(async () => {
    await mongoConnection.connect();
  });
  beforeEach(async () => {
    timeNow = 0;
    await Queue.deleteMany({ queue: testQueue });
    for (let i = 0; i < 5; i++) {
      await Queue.enqueue({
        spec: {
          task: 'test',
          version: 0,
          taskType: 'testTask',
          timeout: 12,
          resources: { cpu: 2, memory: (100 - i) * 1024 ** 2 },
          retries: 3,
        }, metadata: { testNumber: i, userId }, queue: testQueue, precache: false,
      });
    }
  });

  it("should correctly scale the priorities", async (done) => {
    const jobs = await Queue.find({
      'message.metadata.userId': userId, state: 'PENDING',
    }).sort({ _id: 1 });
    assert.equal(jobs[4].message.priority + 4, jobs[0].message.priority);
    for (let i = 0; i < 5; i++) {
      await Queue.enqueue({
        spec: {
          task: 'test',
          version: 0,
          taskType: 'testTask',
          timeout: 12,
          resources: { cpu: 2, memory: (100 - i) * 1024 ** 2 },
          retries: 3,
        }, metadata: { testNumber: i, userId: altUserId }, queue: testQueue, precache: false,
      });
    }
    const altJobs = await Queue.find({
      'message.metadata.userId': altUserId, state: 'PENDING',
    }).sort({ _id: 1 });
    assert.equal(altJobs[4].message.priority + 4, altJobs[0].message.priority);
    await Queue.deleteMany({ 'message.metadata.userId': altUserId });

    done();
  });


  it("should requeue if not-acked", async (done) => {
    assert.equal(await Queue.queueLength({}, {}, testQueue), 5);

    // Take a job but don't ack it in time
    const job = await Queue.dequeue({ cpu: 64 }, {}, testQueue);
    assert.equal(await Queue.queueLength({}, {}, testQueue), 4);
    timeNow += Queue.ackWindow + 1;
    const anotherWorkerJob = await Queue.dequeue({ cpu: 64 }, {}, testQueue);
    const ackOk = await Queue.ack(job);
    assert.ok(!ackOk);
    assert.equal(job._id.toString(), anotherWorkerJob._id.toString());

    // Acking the job works
    timeNow += 5;
    assert.ok(await Queue.ack(anotherWorkerJob));
    timeNow += 5;
    assert.ok(await Queue.handleSuccess(anotherWorkerJob));
    assert.equal(await Queue.queueLength({}, {}, testQueue), 4);
    done();
  });

  it("should requeue a job which times out", async (done) => {
    try {
      // Worker doesn't complete a job before the timeout
      timeNow += 5;
      const job = await Queue.dequeue({ cpu: 64 }, {}, testQueue);
      await Queue.ack(job);
      assert.equal(await Queue.queueLength({}, {}, testQueue), 4);
      timeNow += job.spec.timeout + 11;
      assert.equal(await Queue.queueLength({}, {}, testQueue), 5);

      // Another worker gets the same job
      const anotherWorkerJob = await Queue.dequeue({ cpu: 64 }, {}, testQueue);
      assert.equal(job._id.toString(), anotherWorkerJob._id.toString());
      assert.ok(await Queue.ack(anotherWorkerJob));
      assert.ok(await Queue.handleSuccess(anotherWorkerJob));
      assert.ok(!await Queue.handleSuccess(job));
      done();
    } catch (err) {
      done(err);
    }
  });

  it("should retry jobs which fail", async (done) => {
    try {
      assert.equal(await Queue.queueLength({}, {}, testQueue), 5);

      // Take a job but fail
      const job = await Queue.dequeue({ cpu: 64 }, {}, testQueue);
      assert.ok(await Queue.ack(job));
      assert.ok(await Queue.handleFailure(job, 'testReason'));

      // Get the same job again and fail with a timeout
      timeNow += 13;
      let anotherWorkerJob = await Queue.dequeue({ cpu: 64 }, {}, testQueue);
      assert.ok(await Queue.ack(anotherWorkerJob));
      assert.equal(job._id.toString(), anotherWorkerJob._id.toString());
      assert.ok(await Queue.handleFailure(anotherWorkerJob, 'testReason'));

      // Get the same job again
      timeNow += 13;
      anotherWorkerJob = await Queue.dequeue({ cpu: 64 }, {}, testQueue);
      assert.ok(await Queue.ack(anotherWorkerJob));
      assert.equal(job._id.toString(), anotherWorkerJob._id.toString());
      assert.ok(!await Queue.handleFailure(anotherWorkerJob, 'testReason'));

      // Get a different job
      timeNow += 13;
      anotherWorkerJob = await Queue.dequeue({ cpu: 64 }, {}, testQueue);
      assert.ok(await Queue.ack(anotherWorkerJob));
      assert.notEqual(job._id.toString(), anotherWorkerJob._id.toString());
      assert.ok(await Queue.handleSuccess(anotherWorkerJob));

      done();
    } catch (err) {
      done(err);
    }
  });

  it(" correctly updates the timeout", async (done) => {
    try {

      assert.equal(await Queue.queueLength({}, {}, testQueue), 5);

      // Take a job but fail
      const job = await Queue.dequeue({ cpu: 64 }, {}, testQueue);
      assert.ok(await Queue.ack(job));
      assert.equal(job.spec.timeout, 12);
      assert.ok(await Queue.handleFailure(job, 'timeout'));

      timeNow += 12;
      let anotherWorkerJob = await Queue.dequeue({ cpu: 64 }, {}, testQueue);
      assert.ok(await Queue.ack(anotherWorkerJob));
      assert.equal(job._id.toString(), anotherWorkerJob._id.toString());
      assert.equal(anotherWorkerJob.spec.timeout, 24);
      assert.ok(await Queue.handleFailure(anotherWorkerJob, 'timeout'));

      timeNow += 25;
      anotherWorkerJob = await Queue.dequeue({ cpu: 64 }, {}, testQueue);
      assert.ok(await Queue.ack(anotherWorkerJob));
      assert.equal(job._id.toString(), anotherWorkerJob._id.toString());
      assert.equal(anotherWorkerJob.spec.timeout, 48);
      assert.equal(false, await Queue.handleFailure(anotherWorkerJob, 'timeout'));

      done();
    } catch (err) {
      done(err);
    }
  });

  it("correctly updates requirements on failure.", async (done) => {
    try {
      assert.equal(await Queue.queueLength({}, {}, testQueue), 5);

      // Take a job but fail
      const job = await Queue.dequeue({ cpu: 64 }, {}, testQueue);
      assert.ok(await Queue.ack(job));
      assert.equal(job.spec.resources.cpu, 2);
      assert.equal(job.spec.timeout, 12);
      assert.ok(await Queue.handleFailure(job, 'testReason'));

      timeNow += 15;
      const updatedJob = await Queue.dequeue({ cpu: 64 }, {}, testQueue);
      assert.ok(await Queue.ack(updatedJob));
      assert.equal(true, updatedJob.spec.resources.cpu > job.spec.resources.cpu);
      assert.equal(true, updatedJob.spec.resources.memory > job.spec.resources.memory);
      assert.ok(await Queue.handleSuccess(updatedJob));

      done();
    } catch (err) {
      done(err);
    }
  });

  after(async () => {
    await mongoConnection.close();
  });
});
