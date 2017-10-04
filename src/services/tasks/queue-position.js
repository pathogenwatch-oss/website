const db = require('mongoose').connection;

module.exports = function ({ uploadedAt }) {
  return new Promise((resolve, reject) => {
    db.collection('_queue').count({
      'message.uploadedAt': { $lt: new Date(uploadedAt) },
      rejectionReason: { $exists: false },
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
