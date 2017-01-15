const { request } = require('services/bus');

const Genome = require('models/genome');

const { ServiceRequestError } = require('utils/errors');

function createGenomeDocument({ name }, reference, user, genomeFileDoc) {
  const { speciesId, speciesName, metrics } = genomeFileDoc;
  return (
    Genome.create({
      _file: genomeFileDoc._id,
      _user: user,
      name,
      speciesId,
      reference,
      public: reference,
    }).
    then(({ _id }) => ({ id: _id, speciesId, speciesName, metrics }))
  );
}

module.exports = ({ stream, metadata, reference, user }) => {
  if (!stream) {
    return Promise.reject(new ServiceRequestError('No stream provided'));
  }

  return (
    request('genome', 'store', { stream })
      .then(genomeFileDoc =>
        createGenomeDocument(metadata, reference, user, genomeFileDoc)
      )
  );
};
