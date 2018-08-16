const db = require('mongoose').connection;

const defaultTypeClause = { $in: [ 'genome', 'task' ] };

module.exports = function ({ uploadedAt, until = uploadedAt, type = defaultTypeClause }) {
  return new Promise((resolve, reject) => {
    db.collection('_queue').count({
      dateCreated: { $lt: new Date(until) },
      rejectionReason: { $exists: false },
      type,
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
