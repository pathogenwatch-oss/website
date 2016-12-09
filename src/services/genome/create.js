const { request } = require('services/bus');

const Genome = require('data/genome');

const { ServiceRequestError } = require('utils/errors');

function createGenomeDocument({ name }, user, genomeFileDoc) {
  const { speciesId, speciesName, metrics } = genomeFileDoc;
  return (
    Genome.create({ _file: genomeFileDoc._id, _user: user, name })
      .then(({ _id }) => ({ id: _id, speciesId, speciesName, metrics }))
  );
}

module.exports = ({ stream, metadata, user }) => {
  if (!stream) {
    return Promise.reject(new ServiceRequestError('No stream provided'));
  }

  return (
    request('genome', 'store', { stream })
      .then(genomeFileDoc =>
        createGenomeDocument(metadata, user, genomeFileDoc)
      )
  );
};
