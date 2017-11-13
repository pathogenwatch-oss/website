const { ObjectID } = require('bson');

const mongoConnection = require('utils/mongoConnection');
const { request } = require('services');
const { getSpeciatorTask } = require('../manifest');

mongoConnection.connect();

module.exports = function ({ genomeId, fileId, uploadedAt, clientId }) {
  const { task, version } = getSpeciatorTask();
  return request('tasks', 'enqueue', {
    genomeId: new ObjectID(genomeId),
    fileId,
    uploadedAt,
    clientId,
    task,
    version,
  });
};
