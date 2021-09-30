const { request } = require('services/bus');

const Genome = require('models/genome');
const { ServiceRequestError } = require('utils/errors');
const { getTaskPriority } = require('../utils');

async function createGenomeDocument({ name, uploadedAt }, { fileId, reference, user }) {
  const doc = await Genome.create({
    _user: user,
    fileId,
    name,
    reference,
    public: reference,
    uploadedAt,
  });

  return doc._id.toString();
}

module.exports = async ({ timeout$, stream, metadata, reference, user, clientId }) => {
  if (!stream) {
    return Promise.reject(new ServiceRequestError('No stream provided'));
  }

  const { fileId } = await request('genome', 'store', { timeout$, stream });
  const genomeId = await createGenomeDocument(metadata, { fileId, reference, user });
  const priority = await getTaskPriority('genome', user._id);

  await request('tasks', 'submit-genome', {
    genomeId,
    fileId,
    uploadedAt: metadata.uploadedAt,
    clientId,
    userId: user._id,
    priority,
  });
  return { id: genomeId };
};
