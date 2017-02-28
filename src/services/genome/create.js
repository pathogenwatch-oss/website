const { request } = require('services/bus');

const Genome = require('models/genome');

const { ServiceRequestError } = require('utils/errors');

function createGenomeDocument({ name, uploadedAt }, reference, { user, sessionID }, genomeFileDoc) {
  const { speciesId, speciesName, metrics } = genomeFileDoc;
  return (
    Genome.create({
      _file: genomeFileDoc._id,
      _user: user,
      _session: sessionID,
      name,
      speciesId,
      reference,
      public: reference,
      uploadedAt,
    }).
    then(({ _id }) => ({ id: _id, speciesId, speciesName, metrics }))
  );
}

module.exports = ({ stream, metadata, reference, user, sessionID }) => {
  if (!stream) {
    return Promise.reject(new ServiceRequestError('No stream provided'));
  }

  return (
    request('genome', 'store', { stream })
      .then(genomeFileDoc =>
        createGenomeDocument(metadata, reference, { user, sessionID }, genomeFileDoc)
      )
  );
};
