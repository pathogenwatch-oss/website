/* eslint-disable no-param-reassign */
const Genome = require('models/genome');
const { ObjectId } = require('mongoose').Types;

module.exports = function ({ user, ids }) {
  const taskNames = [
    'core',
    'cgmlst',
    'cgmlst-classifier',
    'genotyphi',
    'inctyper',
    'kaptive',
    'kleborate',
    'metrics',
    'mlst',
    'mlst2',
    'ngmast',
    'ngstar',
    'paarsnp',
    'pangolin',
    'poppunk2',
    'sarscov2-variants',
    'serotype',
    'speciator',
    'spn_pbp_amr',
    'vista',
  ];
  const haveSource = [ 'mlst', 'mlst2', 'cgmlst' ];
  const $in = ids.map((id) => new ObjectId(id));
  // It appears there is a bug in mongodb that prevented the previous implementation
  // from supporting 'cgmlst' & 'cgmlst-classifier' as task names.
  // Trying to use both as `analysis.${task}` caused a path conflict error for cgmlst.source.
  // There's probably a way still to combine queries 2 & 3, but this at least works around the bug.
  const taskQueries = [
    Genome.aggregate([
      {
        $match: {
          _id: { $in },
          'analysis.speciator.speciesId': { $exists: true },
          ...Genome.getPrefilterCondition({ user }),
        },
      },
      {
        $group: {
          _id: {
            speciesId: '$analysis.speciator.speciesId',
            speciesName: '$analysis.speciator.speciesName',
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          speciesId: '$_id.speciesId',
          speciesName: '$_id.speciesName',
          total: '$count',
          _id: 0,
        },
      },
    ]),
    Genome.aggregate([
      {
        $match: {
          _id: { $in },
          'analysis.speciator.speciesId': { $exists: true },
          ...Genome.getPrefilterCondition({ user }),
        },
      },
      {
        $facet: taskNames.reduce((memo, task) => {
          memo[task] = [
            { $match: { [`analysis.${task}`]: { $exists: true } } },
            {
              $group: {
                _id: { speciesId: '$analysis.speciator.speciesId' },
                genomeIds: { $push: '$_id' },
              },
            },
          ];
          return memo;
        }, {}),
      },
    ]),
    Genome.aggregate([
      {
        $match: {
          _id: { $in },
          'analysis.speciator.speciesId': { $exists: true },
          ...Genome.getPrefilterCondition({ user }),
        },
      },
      {
        $facet: haveSource.reduce((memo, task) => {
          memo[task] = [
            { $match: { [`analysis.${task}.source`]: { $exists: true } } },
            {
              $group: {
                _id: { speciesId: '$analysis.speciator.speciesId' },
                sources: { $addToSet: `$analysis.${task}.source` },
              },
            },
          ];
          return memo;
        }, {}),
      },
    ]),
  ];
  return Promise.all(taskQueries)
    .then(([ organisms, [ organismsByTask ], [ organismBySources ] ]) => {
      const summary = {};
      for (const organism of organisms) {
        summary[organism.speciesId] = { tasks: [], ...organism };
      }
      for (const task of Object.keys(organismsByTask)) {
        for (const { _id, genomeIds } of organismsByTask[task]) {
          if (_id.speciesId in summary) {
            const sources = task in organismBySources ? organismBySources[task].find(record => record._id.speciesId === _id.speciesId).sources : new Set();
            summary[_id.speciesId].tasks.push({ ids: genomeIds, sources, task });
          }
        }
      }
      return Object.keys(summary)
        .map((key) => summary[key])
        .filter((_) => _.tasks && _.tasks.length > 0);
    });
};
