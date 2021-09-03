const Genome = require('models/genome');
const { request } = require('services');

const { ServiceRequestError, NotFoundError } = require('utils/errors');

module.exports = async ({ user, id, collectionId, projection = {} }) => {
  if (!id) throw new ServiceRequestError('Missing Id');

  const $or = [ { public: true } ];
  if (collectionId) {
    const collection = await request('collection', 'authorise', { user, token: collectionId, projection: { genomes: 1 } });
    // console.log(collection.genomes, id, collection.genomes.find((genome) => genome.toString() === id));
    if (collection.genomes.find((genome) => genome.toString() === id)) {
      $or.push({ _id: id });
    }
  }

  if (user) {
    $or.push({ _user: user._id });
  }

  return Genome.findOne({ _id: id, $or }, projection)
    .then((record) => {
      if (!record) throw new NotFoundError('Not found or access denied');
      return record.toObject({ user });
    });
};
