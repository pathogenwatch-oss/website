const Queue = require('../../models/queue');

const limit = 500;

// This method really only provides an estimate of queue position
module.exports = async function ({ userId, type }) {
  const cursor = Queue
    .find({ state: 'PENDING' })
    .sort({ 'message.priority': -1, _id: 1 })
    .limit(limit)
    .select({ 'message.metadata.userId': 1, 'message.spec.taskType': 1 })
    .lean()
    .cursor();

  let position = 0;

  for await (const doc of cursor) {
    if (!!doc.message.metadata.userId && doc.message.metadata.userId.equals(userId)) {
      if (!!type && doc.message.spec.taskType !== type) {
        continue;
      }
      break;
    }
    position += 1;
  }
  if (position === limit) {
    position = `${limit}+`;
  }
  return Promise.resolve({ position });
};
