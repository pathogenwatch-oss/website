const Genome = require('../../models/genome');
const { ServiceRequestError } = require('utils/errors');

module.exports = function ({ user, latitude, longitude }) {
  if (!latitude || !longitude) throw new ServiceRequestError('No coordinates provided');

  return Genome.aggregate([
    {
      $match: Object.assign(
        { latitude, longitude, 'analysis.speciator': { $exists: true } },
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
