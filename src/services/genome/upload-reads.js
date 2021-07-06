const { request } = require('services/bus');

const Genome = require('models/genome');

const { ServiceRequestError } = require('utils/errors');

module.exports = async ({ timeout$, stream, filename, user, id, clientId }) => {
  if (!stream) {
    throw new ServiceRequestError('No stream provided');
  }

  if (!user) {
    throw new ServiceRequestError('Not authorised');
  }

  const doc = await Genome.findOne({ _user: user, _id: id }, { upload: 1, uploadedAt: 1 }).lean();
  if (doc === null) {
    throw new ServiceRequestError('Not authorised');
  }

  const { upload = {} } = doc;
  const { files = [] } = upload;
  const fileNumber = files.indexOf(filename) + 1;
  if (fileNumber === 0) throw new ServiceRequestError('Not authorised');

  await request('genome', 'store-reads', { genomeId: id, timeout$, stream, fileNumber });

  return { ok: 1 };
};
