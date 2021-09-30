const db = require('mongoose').connection;

const defaultTypeClause = { $in: [ 'genome', 'task' ] };

// This method really only provides an estimate of queue position
module.exports = function ({ uploadedAt, until = uploadedAt, type = defaultTypeClause }) {
  return new Promise((resolve, reject) => {
    db.collection('queue').count({
      'message.metadata.uploadedAt': { $lt: new Date(until) },
      rejectionReason: { $eq: null },
      'message.spec.taskType': type,
      'message.priority': { $gt: -1 },
    },
    (err, position) => {
      if (err) {
        reject(err);
      } else {
        resolve({ position });
      }
    }
    );
  });
};
