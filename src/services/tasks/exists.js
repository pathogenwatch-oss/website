const Analysis = require('models/analysis');

module.exports = function ({ fileId, task, version, organismId }) {
  return Analysis.count({ fileId, task, version, organismId })
    .then(count => count > 0);
};
