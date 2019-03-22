const Genome = require('../../models/genome');
const { ObjectId } = require('mongoose').Types;
const { ServiceRequestError } = require('utils/errors');

module.exports = function ({ user, ids }) {
  if (!ids.length) throw new ServiceRequestError('No ids provided');

  const $in = ids.map(id => new ObjectId(id));
  return Genome.aggregate([
    {
      $match: Object.assign(
        { _id: { $in }, 'analysis.speciator': { $exists: true } },
        Genome.getPrefilterCondition({ user })
      ),
    },
    {
      $group: {
        _id: {
          organismId: '$analysis.speciator.organismId',
          speciesName: '$analysis.speciator.speciesName',
        },
        genomes: { $push: { id: '$_id', name: '$name' } },
      },
    },
    {
      $project: {
        organismId: '$_id.organismId',
        speciesName: '$_id.speciesName',
        genomes: 1,
        _id: 0,
      },
    },
  ]);
};
