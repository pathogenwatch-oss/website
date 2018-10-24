const { request } = require('services/bus');

const Genome = require('models/genome');

const { ServiceRequestError } = require('utils/errors');

async function createGenomeDocument({ name, filename = name, uploadedAt }, { fileId, reference, user }) {
  const doc = await Genome.create({
    _user: user,
    fileId,
    name,
    filename,
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
  await request('tasks', 'submit-genome', { genomeId, fileId, uploadedAt: metadata.uploadedAt, clientId, userId: user._id });
  return { id: genomeId };
};
