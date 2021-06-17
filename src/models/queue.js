const mongoose = require('mongoose');
const { Schema } = mongoose;

const config = require('configuration');

const GB = 1024 ** 3;
const MAX_MEMORY = 30 * GB;
const defaultRetries = config.tasks.retries || 3;

let now = () => Math.floor(new Date() / 1000);

const taskTypes = {
  genome: 'genome',
  task: 'task',
  collection: 'collection',
  clustering: 'clustering',
}

const schema = new Schema({
  ack: Schema.Types.ObjectId,

  message: { // Has PW specific parameters
    task: { type: String, required: true },
    taskType: { type: String, default: 'task' },
    version: { type: String, required: true },
    metadata: Object,
    resources: {
      memory: { type: Number, required: true },
      cpu: { type: Number, required: true },
    },
    spec: {
      timeout: { type: Number, required: true }
    },
  },

  // These are queue implementation parameters
  nextReceivableTime: { type: Number, default: null },
  queue: { type: String, index: true },
  rejectionReason: { type: String, default: null },
  rejectedTime: Number,
  attempts: { type: Number, default: 0, required: true },
  maxAttempts: { type: Number, default: 1, required: true },
});

schema.index({ ack: 1 }, { sparse: true });
schema.index({ queue: 1, rejectedTime: 1, 'message.resources.memory': 1, 'message.resources.cpu': 1, _id: 1, nextReceivableTime: 1 });

schema.statics.enqueue = async function(taskType, spec, metadata, queue = 'normal') {
  const {
    task,
    version,
    retries: maxAttempts = defaultRetries,
    resources,
  } = spec;
  
  const item = new this({
    message: {
      task,
      taskType,
      version,
      metadata,
      resources,
      spec,
    },
    queue,
    maxAttempts,
  })
  await item.save();
}

const ackWindow = 30;

schema.statics.dequeue = async function(limits = {}, constraints={}, queue = 'normal') {
  const resourceQuery = {}
  for (const key in limits) resourceQuery[`message.resources.${key}`] = { $lte: limits[value] }
  const fullQuery = {
    ...resourceQuery,
    ...constraints,
    queue,
    rejectedTime: null,
    $or: [{ nextReceivableTime: null }, { nextReceivableTime: { $lte: now() } }],
  }

  const doc = await this.findOneAndUpdate(
    fullQuery,
    { $set: { ack: new mongoose.Types.ObjectId(), nextReceivableTime: now() + ackWindow }},
    { new: true, sort: { '_id': 1 } },
  ).lean();

  return doc;
}

schema.statics.handleFailure = async function(oldDoc, rejectionReason ) {
  const { ack, message } = oldDoc;
  const { spec = {}, resources = {} } = message;
  const { timeout } = spec;
  const { memory } = resources;

  const update = { 
    nextReceivableTime: now() + 10,
    rejectionReason,
  }

  if (timeout) update['message.spec.timeout'] = timeout * 2;
  if (memory) update['message.resources.memory'] = Math.floor(MAX_MEMORY, memory * 2);
  
  const doc = await this.findOneAndUpdate(
    { ack, $expr: { $gt: [ "$maxAttempts", "$attempts" ]} },
    { 
      $unset: { ack: 1 },
      $set: update,
    },
    { new: true }
  )

  if (doc !== null) return true; // It will be retried
  await this.findOneAndUpdate(
    { ack },
    {
      $unset: { ack: 1 },
      $set: { rejectionReason, rejectedTime: now() },
      $inc: { attempts: 1 },
    }
  )
  return false; // It will not be retried
}

schema.statics.handleSuccess = async function({ ack }) {
  const doc = await this.findOneAndRemove(
    { ack },
    { projection: { ack: 1 }},
  )
  return doc !== null;
}

schema.statics.ack = async function(job) {
  const { ack = 'invalid' } = job;
  const { timeout } = (job.message || {}).spec || {}
  const doc = await this.findOneAndUpdate(
    { ack },
    { 
      $set: { nextReceivableTime: now() + timeout },
      $inc: { attempts: 1 },
    }
  )
  return doc !== null;
}

schema.statics.queueLength = async function(limits = {}, constraints={}, queue = 'normal') {
  const resourceQuery = {}
  for (const key in limits) resourceQuery[`message.resources.${key}`] = { $lte: limits[value] }
  const fullQuery = {
    ...resourceQuery,
    ...constraints,
    queue,
    rejectedTime: null,
    $or: [{ nextReceivableTime: null }, { nextReceivableTime: { $lte: now() } }],
  }

  return this.count(fullQuery);
}

module.exports = mongoose.model('Queue', schema, 'queue');
module.exports.taskTypes = taskTypes;
module.exports.ackWindow = ackWindow;
module.exports.overideNow = fn => { now = fn }; // used for testing