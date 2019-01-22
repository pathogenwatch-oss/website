const Genome = require('models/genome');

const { ServiceRequestError } = require('utils/errors');
const validateMetadata = require('pathogenwatch-front-end/universal/validateMetadata');

module.exports = async function({ id, user, metadata, reference }) {
  if (!reference && !user) {
    throw new ServiceRequestError('Not authenticated');
  }

  try {
    validateMetadata(metadata);
  } catch (e) {
    console.error(e);
    throw new ServiceRequestError(e.message);
  }

  const count = await Genome.count({ _id: id, _user: user });

  if (count === 0) {
    throw new ServiceRequestError('No genome found with id/user combination');
  }

  const { country } = await Genome.updateMetadata(id, { user }, metadata);
  return { id, country };
};
