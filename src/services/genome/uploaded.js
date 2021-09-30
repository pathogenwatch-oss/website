const { request } = require('services/bus');
const Genome = require('models/genome');
const store = require('utils/object-store');
const { ServiceRequestError } = require('utils/errors');
const { getTaskPriority } = require('../utils');

module.exports = async ({ user, id, clientId }) => {
  if (!user) {
    throw new ServiceRequestError('Not authorised');
  }

  const doc = await Genome.findOneAndUpdate(
    { _id: id, _user: user },
    { $set: { 'upload.complete': true } },
    { new: true, projection: { uploadedAt: true } }
  );
  if (!doc) throw new ServiceRequestError('Not authorised');

  const readsKeys = await store.listReads(id);

  if (readsKeys.length !== 2) throw new ServiceRequestError(`Expected 2 read files, got ${readsKeys.length}`);

  const priority = await getTaskPriority('assembly', user._id);

  await request('tasks', 'submit-assembly', {
    clientId,
    genomeId: id,
    readsKeys,
    uploadedAt: doc.uploadedAt,
    userId: user._id,
    priority,
  });

  return { ok: 1 };
};
