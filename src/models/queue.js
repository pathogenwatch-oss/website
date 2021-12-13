const mongoose = require('mongoose');

const { Schema } = mongoose;

const config = require('configuration');
const { formatMemory, formatTime } = require('manifest');

const User = require('models/user');

const MAX_MEMORY = formatMemory(process.env.MAX_MEMORY || '30g');
const MAX_TIMEOUT = formatTime('1h');
const MAX_CPU = 15;
const defaultRetries = config.tasks.retries || 3;

const fairUseTaskTypes = { genome: 1, task: 1, assembly: 10, testTask: 1 };

let now = () => Math.floor(new Date() / 1000);

const state = {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  FAILED: 'FAILED',
};

const schema = new Schema({
  ack: Schema.Types.ObjectId,

  message: { // Has PW specific parameters
    metadata: Object,
    precache: { type: Boolean, default: false },
    priority: { type: Number, default: 0 },
    spec: {
      task: { type: String, required: true },
      taskType: { type: String, default: 'task' },
      version: { type: String, required: true },
      timeout: { type: Number, required: true },
      resources: {
        memory: { type: Number, required: true },
        cpu: { type: Number, required: true },
      },
    },
  },

  // These are queue implementation parameters
  nextReceivableTime: { type: Number, default: null },
  queue: { type: String, index: true },
  state: { type: String, default: state.PENDING },
  startTime: { type: Number },
  rejectedTime: { type: Number, default: null },
  rejectionReason: { type: String, default: null },
  attempts: { type: Number, default: 0, required: true },
  maxAttempts: { type: Number, default: 1, required: true },
}, { strict: false });

schema.index({ ack: 1 }, { sparse: true });
schema.index({
  queue: 1,
  rejectedTime: 1,
  'message.spec.resources.memory': 1,
  'message.resources.cpu': 1,
  'message.priority': -1,
  _id: 1,
  nextReceivableTime: 1,
});

schema.index({
  'message.priority': -1,
  _id: 1,
});

schema.index({
  state: 1,
  'message.metadata.userId': 1,
  'message.metadata.taskType': 1,
  'message.priority': 1,
  _id: 1,
});

const ackWindow = 30;

schema.statics.dequeue = async function (limits = {}, constraints = {}, queue = 'normal') {
  const resourceQuery = [];
  for (const key of Object.keys(limits)) {
    resourceQuery.push({
      $or: [
        { [`message.spec.resources.${key}`]: { $exists: false } },
        { [`message.spec.resources.${key}`]: { $lte: limits[key] } },
      ],
    });
  }
  const fullQuery = {
    $and: resourceQuery,
    ...constraints,
    queue,
    rejectedTime: null,
    $expr: { $lt: [ '$attempts', '$maxAttempts' ] },
    $or: [ { nextReceivableTime: null }, { nextReceivableTime: { $lte: now() } } ],
  };

  const doc = await this.findOneAndUpdate(
    fullQuery,
    { $set: { ack: new mongoose.Types.ObjectId(), nextReceivableTime: now() + ackWindow } },
    { new: true, sort: { 'message.priority': -1, _id: 1 } },
  ).lean();

  if (doc) {
    return {
      ack: doc.ack,
      ackWindow,
      ...doc.message,
      retry: doc && doc.maxAttempts - doc.attempts > 1,
      _id: doc._id,
    };
  }
  return null;
};

schema.statics.handleFailure = async function (job, rejectionReason) {
  const { ack, spec = {} } = job;
  const { resources = {}, timeout } = spec;
  const { cpu = 1, memory } = resources;

  const update = {
    nextReceivableTime: now() + 10,
    rejectionReason,
    state: state.PENDING,
  };

  if (timeout && rejectionReason === 'timeout') {
    update['message.spec.resources.cpu'] = Math.min(Math.ceil(cpu * 1.4), MAX_CPU);
    update['message.spec.timeout'] = Math.min(timeout * 2, MAX_TIMEOUT);
  } else if (memory && (rejectionReason === 'killed' || rejectionReason.endsWith('killed.'))) update['message.spec.resources.memory'] = Math.min(memory * 2, MAX_MEMORY);
  else {
    // The general case. If a particular type or combination of tasks is
    // causing failures through load, scaling up requirements provides a
    // bit more robustness to tasks all getting processed.
    update['message.spec.resources.cpu'] = Math.min(Math.ceil(cpu * 1.4), MAX_CPU);
    if (memory) update['message.spec.resources.memory'] = Math.min(Math.round(memory * 1.4), MAX_MEMORY);
  }

  const doc = await this.findOneAndUpdate(
    { ack, $expr: { $gt: [ "$maxAttempts", "$attempts" ] } },
    {
      $unset: { ack: 1 },
      $set: update,
    },
    { new: true }
  );

  if (doc !== null) return true; // It will be retried

  await this.findOneAndUpdate(
    { ack },
    {
      $unset: { ack: 1 },
      $set: { rejectionReason, rejectedTime: now(), state: state.FAILED },
      $inc: { attempts: 1 },
    }
  );
  return false; // It will not be retried
};

schema.statics.handleSuccess = async function ({ ack }) {
  const doc = await this.findOneAndRemove(
    { ack },
    { projection: { ack: 1 } },
  );
  return doc !== null;
};

schema.statics.ack = async function (job, started = true) {
  const { ack = 'invalid', spec = {} } = job;
  const { timeout } = spec;
  const update = {
    $set: { nextReceivableTime: now() + timeout + 10 },
  };
  if (started) {
    update.$inc = { attempts: 1 };
    update.$set.state = state.RUNNING;
    update.$set.startTime = Number(new Date());
  }
  const doc = await this.findOneAndUpdate(
    { ack },
    update,
  );
  return doc !== null;
};

schema.statics.requeue = async function (job) {
  const { ack = 'invalid' } = job;
  const update = {
    $set: {
      nextReceivableTime: now() + ackWindow,
      state: state.PENDING,
      startTime: null,
    },
  };
  const doc = await this.findOneAndUpdate(
    { ack },
    update,
  );
  return doc !== null;
};

schema.statics.queueLength = async function (limits = {}, constraints = {}, queue = 'normal') {
  const resourceQuery = {};
  for (const key of Object.keys(limits)) {
    resourceQuery[`message.spec.resources.${key}`] = { $or: [ { $exists: false }, { $lte: limits[key] } ] };
  }
  const fullQuery = {
    ...resourceQuery,
    ...constraints,
    queue,
    rejectedTime: null,
    $or: [ { nextReceivableTime: null }, { nextReceivableTime: { $lte: now() } } ],
  };

  return this.count(fullQuery);
};

schema.statics.determinePriority = async function ({ spec: { taskType }, metadata: { userId } }) {
  if (taskType in fairUseTaskTypes && !!userId) {
    const current = await this.find(
      {
        'message.metadata.userId': userId,
        state: 'PENDING',
        'message.spec.taskType': { $in: Object.keys(fairUseTaskTypes) },
      }, {
        _id: 0,
        'message.priority': 1,
      })
      .sort({
        'message.priority': 1,
        _id: 1,
      })
      .limit(1);

    if (current.length !== 0) {
      return current[0].message.priority - fairUseTaskTypes[taskType];
    }

    const user = await User.findOne({ _id: userId }, { priority: 1 }).lean();
    const userPriority = !!user && 'priority' in user ? user.priority : 0;

    return userPriority - fairUseTaskTypes[taskType];
  }
  return 1;
};

const model = mongoose.model('Queue', schema, 'queue');
module.exports = model;
module.exports.state = state;
module.exports.ackWindow = ackWindow;
module.exports.overrideNow = (fn) => {
  now = fn;
}; // used for testing
module.exports.now = now;


module.exports.enqueue = async function ({ spec, metadata, queue = 'normal', precache = false, overridePriority }) {
  const maxAttempts = spec.retries || defaultRetries;

  // Override priority is for use by update scripts such as submit/task.js
  const priority = !!overridePriority
    ? overridePriority :
    await model.determinePriority({ spec, metadata });

  // eslint-disable-next-line new-cap
  const item = new model({
    message: {
      metadata,
      precache,
      priority,
      spec,
    },
    queue,
    maxAttempts,
  });
  await item.save();
};
