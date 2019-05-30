const Genome = require('models/genome');

const { ServiceRequestError } = require('utils/errors');

module.exports = async ({ user, id, error }) => {
  if (!user) {
    throw new ServiceRequestError('Not authorised');
  }

  const count = await Genome.count({ _user: user, _id: id });
  if (count !== 1) {
    throw new ServiceRequestError('Not authorised');
  }

  await Genome.update({ _user: user, _id: id }, { $set: { 'assembler.error': error } });
};
