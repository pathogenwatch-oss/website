const mongoose = require('mongoose');

const { Schema } = mongoose;

const config = require('configuration');
const { formatMemory, formatTime } = require('manifest');

const MAX_MEMORY = formatMemory(process.env.MAX_MEMORY || '30g');
const MAX_TIMEOUT = formatTime('1h');
const defaultRetries = config.tasks.retries || 3;

let now = () => Math.floor(new Date() / 1000);

const schema = new Schema({
  ack: Schema.Types.ObjectId,

  message: { // Has PW specific parameters
    metadata: Object,
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
  rejectionReason: { type: String, default: null },
  rejectedTime: { type: Number, default: null },
  attempts: { type: Number, default: 0, required: true },
  maxAttempts: { type: Number, default: 1, required: true },
}, { strict: false });

schema.index({ ack: 1 }, { sparse: true });
schema.index({ queue: 1, rejectedTime: 1, 'message.spec.resources.memory': 1, 'message.resources.cpu': 1, _id: 1, nextReceivableTime: 1 });

const ackWindow = 30;

schema.statics.dequeue = async function (limits = {}, constraints = {}, queue = 'normal') {
  const resourceQuery = {};
  for (const key of Object.keys(limits)) resourceQuery[`message.spec.resources.${key}`] = { $lte: limits[key] };
  const fullQuery = {
    ...resourceQuery,
    ...constraints,
    queue,
    rejectedTime: null,
    $or: [{ nextReceivableTime: null }, { nextReceivableTime: { $lte: now() } }],
  };

  const doc = await this.findOneAndUpdate(
    fullQuery,
    { $set: { ack: new mongoose.Types.ObjectId(), nextReceivableTime: now() + ackWindow } },
    { new: true, sort: { _id: 1 } },
  ).lean();

  if (doc) return { ack: doc.ack, ackWindow, ...doc.message };
  return null;
};

schema.statics.handleFailure = async function (job, rejectionReason) {
  const { ack, spec = {} } = job;
  const { resources = {}, timeout } = spec;
  const { memory } = resources;

  const update = {
    nextReceivableTime: now() + 10,
    rejectionReason,
  };

  if (timeout) update['message.spec.timeout'] = Math.min(timeout * 2, MAX_TIMEOUT);
  if (memory) update['message.spec.resources.memory'] = Math.floor(MAX_MEMORY, memory * 2);

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
      $set: { rejectionReason, rejectedTime: now() },
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

schema.statics.ack = async function (job, incrementAttempts = true) {
  const { ack = 'invalid', spec = {} } = job;
  const { timeout } = spec;
  const update = {
    $set: { nextReceivableTime: now() + timeout + 10 },
  };
  if (incrementAttempts) update.$inc = { attempts: 1 };
  const doc = await this.findOneAndUpdate(
    { ack },
    update,
  );
  return doc !== null;
};

schema.statics.queueLength = async function (limits = {}, constraints = {}, queue = 'normal') {
  const resourceQuery = {};
  for (const key of Object.keys(limits)) resourceQuery[`message.spec.resources.${key}`] = { $lte: limits[key] };
  const fullQuery = {
    ...resourceQuery,
    ...constraints,
    queue,
    rejectedTime: null,
    $or: [{ nextReceivableTime: null }, { nextReceivableTime: { $lte: now() } }],
  };

  return this.count(fullQuery);
};

const model = mongoose.model('Queue', schema, 'queue');
module.exports = model;
module.exports.ackWindow = ackWindow;
module.exports.overideNow = (fn) => { now = fn; }; // used for testing

module.exports.enqueue = async function (spec, metadata, queue = 'normal') {
  const maxAttempts = spec.retries || defaultRetries;

  // eslint-disable-next-line new-cap
  const item = new model({
    message: {
      metadata,
      spec,
    },
    queue,
    maxAttempts,
  });
  await item.save();
};
