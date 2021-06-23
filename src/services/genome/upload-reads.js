const { request } = require('services/bus');

const Genome = require('models/genome');

const { ServiceRequestError } = require('utils/errors');

module.exports = async ({ timeout$, stream, fileName, user, id, clientId }) => {
  if (!stream) {
    throw new ServiceRequestError('No stream provided');
  }

  if (!user) {
    throw new ServiceRequestError('Not authorised');
  }

  const doc = await Genome.findOne({ _user: user, _id: id }, { files, uploadedAt }).lean();
  if (doc === null) {
    throw new ServiceRequestError('Not authorised');
  }

  const { files: [] } = doc;
  const fileNumber = files.indexOf(fileName) + 1;
  if (fileNumber === 0) throw new ServiceRequestError('Not authorised');

  await request('genome', 'store-reads', { genomeId: id, timeout$, stream, fileNumber });
  const readsKeys = await request('genome', 'check-reads', { genomeId: id });
  if (readsKeys.length < files.length) return { ok: 1, message: "waiting for more reads" };
  if (readsKeys.length > files.length) throw new ServiceRequestError('Got too many reads');
  
  await request('tasks', 'submit-assembly', {
    clientId,
    genomeId: id,
    readsKeys,
    uploadedAt: doc.uploadedAt,
    userId: user._id,
  });

  return { ok: 1, message: "enqueued assembly" };
};
