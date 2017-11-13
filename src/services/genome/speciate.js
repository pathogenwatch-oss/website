const path = require('path');
const WorkerNodes = require('worker-nodes');
const workers = new WorkerNodes(path.resolve(path.join(__dirname), '..', 'speciate-worker.js'));

module.exports = function ({ genomeId, fileId, uploadedAt, clientId }) {
  return workers.call({ genomeId, fileId, uploadedAt, clientId });
};
