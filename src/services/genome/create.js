const { request } = require('services/bus');

const Genome = require('models/genome');

const { ServiceRequestError } = require('utils/errors');

function createGenomeDocument({ name, uploadedAt }, { reference, user, sessionID }) {
  return (
    Genome.create({
      _user: user,
      _session: sessionID,
      name,
      reference,
      public: reference,
      uploadedAt,
    }).
    then(({ _id }) => _id)
  );
}

module.exports = ({ timeout$, stream, metadata, reference, user, sessionID }) => {
  if (!stream) {
    return Promise.reject(new ServiceRequestError('No stream provided'));
  }

  return (
    request('genome', 'store', { timeout$, stream })
      .then(({ fileId, filePath }) => {
        createGenomeDocument(metadata, { reference, user, sessionID })
          .then(genomeId => {
            request('genome', 'process', { genomeId, fileId, filePath, sessionID });
            return { id: genomeId };
          });
      })
  );
};
