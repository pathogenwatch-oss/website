const Genome = require('models/genome');
const { request } = require('services');
const { ServiceRequestError } = require('../../utils/errors');

module.exports = async ({ user, token, genomeIds }) => {
  const collection = await request('collection', 'authorise', {
    user, token, projection: { genomes: 1 },
  });
  const count = await Genome.count({
    _id: { $in: genomeIds },
    $or: [ { public: true }, { _id: { $in: collection.genomes } } ],
  });
  if (genomeIds.length !== count) throw new ServiceRequestError('Invalid Genome IDs');
};
