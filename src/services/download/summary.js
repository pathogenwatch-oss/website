const Genome = require('../../models/genome');
const { ObjectId } = require('mongoose').Types;

module.exports = function ({ user, ids }) {
  const taskNames = [ 'mlst', 'speciator', 'paarsnp', 'genotyphi', 'ngmast', 'cgmlst', 'metrics' ];
  if (user && user.showKlebExperiment) taskNames.push('kleborate');
  const $in = ids.map(id => new ObjectId(id));
  return Promise.all([
    Genome.aggregate([
      { $match: Object.assign(
        { _id: { $in }, 'analysis.speciator.speciesId': { $exists: true } },
        Genome.getPrefilterCondition({ user })
      ) },
      { $group: { _id: { speciesId: '$analysis.speciator.speciesId', speciesName: '$analysis.speciator.speciesName' }, count: { $sum: 1 } } },
      { $project: { speciesId: '$_id.speciesId', speciesName: '$_id.speciesName', total: '$count', _id: 0 } },
    ]),
    Genome.aggregate([
      { $match: Object.assign(
        { _id: { $in }, 'analysis.speciator.speciesId': { $exists: true } },
        Genome.getPrefilterCondition({ user })
      ) },
      { $facet: taskNames.reduce((memo, task) => {
        memo[task] = [
          { $match: { [`analysis.${task}`]: { $exists: true } } },
          { $group: { _id: { speciesId: '$analysis.speciator.speciesId' }, genomeIds: { $push: '$_id' }, sources: { $addToSet: `$analysis.${task}.source` } } },
        ];
        return memo;
      }, {}) },
    ]),
  ])
  .then(([ organsisms, [ organismsByTask ] ]) => {
    const summary = {};
    for (const organism of organsisms) {
      summary[organism.speciesId] = Object.assign({ tasks: [] }, organism);
    }
    for (const task of Object.keys(organismsByTask)) {
      for (const { _id, genomeIds, sources } of organismsByTask[task]) {
        if (_id.speciesId in summary) {
          summary[_id.speciesId].tasks.push({ ids: genomeIds, sources, task });
        }
      }
    }
    return Object.keys(summary).map(key => summary[key]);
  });
};
