const Genome = require('../../models/genome');
const { ObjectId } = require('mongoose').Types;
const { ServiceRequestError } = require('utils/errors');

module.exports = function ({ user, sessionID, ids }) {
  if (!ids.length) throw new ServiceRequestError('No ids provided');

  const $in = ids.map(id => new ObjectId(id));
  return Genome.aggregate([
    { $match: Object.assign(
      { _id: { $in }, 'analysis.speciator': { $exists: true } },
      Genome.getPrefilterCondition({ user, sessionID })
    ) },
    { $group: { _id: { organismId: '$organismId', organismName: '$analysis.speciator.organismName' }, genomes: { $push: { id: '$_id', name: '$name' } } } },
    { $project: { organismId: '$_id.organismId', organismName: '$_id.organismName', genomes: 1, _id: 0 } },
  ]);
};
