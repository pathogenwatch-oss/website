const Genome = require('../../models/genome');
const { ServiceRequestError } = require('utils/errors');

module.exports = function ({ user, coordinates }) {
  if (!Array.isArray(coordinates) || !coordinates.length) {
    throw new ServiceRequestError('No coordinates provided');
  }
  const $or = [];
  for (const [ latitude, longitude ] of coordinates) {
    if (typeof latitude === 'number' && typeof longitude === 'number') {
      $or.push({ latitude, longitude });
    } else {
      throw new ServiceRequestError('Coordinates are not numbers');
    }
  }
  return Genome.aggregate([
    {
      $match: { 'analysis.speciator': { $exists: true }, $or },
    },
    {
      $match: Genome.getPrefilterCondition({ user }),
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
