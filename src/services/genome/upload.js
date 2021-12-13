const { request } = require('services/bus');

const Genome = require('models/genome');

const { ServiceRequestError } = require('utils/errors');

module.exports = async ({ timeout$, stream, userId, id, clientId }) => {
  if (!stream) {
    throw new ServiceRequestError('No stream provided');
  }

  if (!userId) {
    throw new ServiceRequestError('Not authorised');
  }

  const count = await Genome.count({ _user: userId, _id: id });
  if (count !== 1) {
    throw new ServiceRequestError('Not authorised');
  }

  const { fileId } = await request('genome', 'store', { timeout$, stream });
  const doc = await Genome.findByIdAndUpdate(
    id,
    { fileId, 'upload.complete': true },
    { fields: { uploadedAt: 1 } }
  );

  await request('tasks', 'submit-genome', {
    clientId,
    fileId,
    genomeId: id,
    uploadedAt: doc.uploadedAt,
    userId,
  });
  return { ok: 1, fileId };
};
