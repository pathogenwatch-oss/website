const Genome = require('../../models/genome');
const { ObjectId } = require('mongoose').Types;

const taskNames = [
  'mlst', 'speciator', 'paarsnp', 'genotyphi', 'ngmast', 'cgmlst',
];

module.exports = function ({ user, sessionID, ids }) {
  const $in = ids.map(id => new ObjectId(id));
  return Promise.all([
    Genome.aggregate([
      { $match: Object.assign(
        { _id: { $in }, 'analysis.speciator': { $exists: true } },
        Genome.getPrefilterCondition({ user, sessionID })
      ) },
      { $group: { _id: { organismId: '$organismId', organismName: '$analysis.speciator.organismName' }, count: { $sum: 1 } } },
      { $project: { organismId: '$_id.organismId', organismName: '$_id.organismName', total: '$count', _id: 0 } },
    ]),
    Genome.aggregate([
      { $match: Object.assign(
        { _id: { $in }, 'analysis.speciator': { $exists: true } },
        Genome.getPrefilterCondition({ user, sessionID })
      ) },
      { $facet: taskNames.reduce((memo, task) => {
        memo[task] = [
          { $match: { [`analysis.${task}`]: { $exists: true } } },
          { $group: { _id: { organismId: '$organismId' }, genomeIds: { $push: '$_id' }, sources: { $addToSet: `$analysis.${task}.source` } } },
        ];
        return memo;
      }, {}) },
    ]),
  ])
  .then(([ organsisms, [ organismsByTask ] ]) => {
    const summary = {};
    for (const organism of organsisms) {
      summary[organism.organismId] = Object.assign({ tasks: [] }, organism);
    }
    for (const task of Object.keys(organismsByTask)) {
      for (const { _id, genomeIds, sources } of organismsByTask[task]) {
        summary[_id.organismId].tasks.push({ ids: genomeIds, sources, task });
      }
    }
    return Object.keys(summary).map(key => summary[key]);
  });
};
