const { request } = require('services/bus');

const Assembly = require('data/assembly');

const { ServiceRequestError } = require('utils/errors');

function createAssemblyDocument({ name }, fastaDoc) {
  const { speciesId, speciesName, metrics } = fastaDoc;
  return (
    Assembly.create({ _fasta: fastaDoc._id, name })
      .then(({ _id }) => ({ id: _id, speciesId, speciesName, metrics }))
  );
}

module.exports = ({ stream, metadata }) => {
  if (!stream) {
    return Promise.reject(new ServiceRequestError('No stream provided'));
  }

  return (
    request('fasta', 'store', { stream })
      .then(fastaDoc =>
        createAssemblyDocument(metadata, fastaDoc)
      )
  );
};
