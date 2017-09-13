const { request } = require('services/bus');

const Genome = require('models/genome');

const { ServiceRequestError } = require('utils/errors');

function createGenomeDocument({ name, uploadedAt }, { fileId, reference, user, sessionID }) {
  return (
    Genome.create({
      _user: user,
      _session: sessionID,
      fileId,
      name,
      reference,
      public: reference,
      uploadedAt,
    })
    .then(({ _id }) => _id.toString())
  );
}

module.exports = ({ timeout$, stream, metadata, reference, user, sessionID, clientId }) => {
  if (!stream) {
    return Promise.reject(new ServiceRequestError('No stream provided'));
  }

  return (
    request('genome', 'store', { timeout$, stream })
      .then(({ fileId }) =>
        createGenomeDocument(metadata, { fileId, reference, user, sessionID })
          .then(genomeId => {
            request('genome', 'specieate', { genomeId, fileId, uploadedAt: metadata.uploadedAt, clientId });
            return { id: genomeId };
          })
      )
  );
};
