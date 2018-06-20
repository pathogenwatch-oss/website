const { request } = require('services/bus');

const Genome = require('models/genome');

const { ServiceRequestError } = require('utils/errors');

function createGenomeDocument({ name, uploadedAt }, { fileId, reference, user }) {
  return (
    Genome.create({
      _user: user,
      fileId,
      name,
      reference,
      public: reference,
      uploadedAt,
    })
    .then(({ _id }) => _id.toString())
  );
}

module.exports = ({ timeout$, stream, metadata, reference, user, clientId }) => {
  if (!stream) {
    return Promise.reject(new ServiceRequestError('No stream provided'));
  }

  return (
    request('genome', 'store', { timeout$, stream })
      .then(({ fileId }) =>
        createGenomeDocument(metadata, { fileId, reference, user })
          .then(genomeId =>
            request('tasks', 'submit-genome', { genomeId, fileId, uploadedAt: metadata.uploadedAt, clientId })
              .then(() => ({ id: genomeId }))
          )
      )
  );
};
