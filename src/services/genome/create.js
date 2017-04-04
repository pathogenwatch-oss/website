const { request } = require('services/bus');

const Genome = require('models/genome');

const { ServiceRequestError } = require('utils/errors');
const submitGenome = require('../../../microservices/runner/submit');

function createGenomeDocument({ name, uploadedAt }, reference, { user, sessionID }, genomeFileDoc) {
  const { organismId, organismName, metrics } = genomeFileDoc;
  return (
    Genome.create({
      _file: genomeFileDoc._id,
      _user: user,
      _session: sessionID,
      name,
      organismId,
      reference,
      public: reference,
      uploadedAt,
    })
    .then((genome) =>
      submitGenome(genome)
        .then(() => ({ id: genome._id, organismId, organismName, metrics }))
    )
  );
}

module.exports = ({ timeout$, stream, metadata, reference, user, sessionID }) => {
  if (!stream) {
    return Promise.reject(new ServiceRequestError('No stream provided'));
  }

  return (
    request('genome', 'store', { timeout$, stream })
      .then(genomeFileDoc =>
        createGenomeDocument(metadata, reference, { user, sessionID }, genomeFileDoc)
      )
  );
};
