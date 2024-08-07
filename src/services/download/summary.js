/* eslint-disable no-param-reassign */
const Genome = require('models/genome');
const { ObjectId } = require('mongoose').Types;

module.exports = function ({ user, ids }) {
  const taskNames = [
    'core',
    'cgmlst',
    'genotyphi',
    'inctyper',
    'kaptive',
    'kleborate',
    'klebsiella-lincodes',
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
  const $in = ids.map((id) => new ObjectId(id));
  return Promise.all([
    Genome.aggregate([
      {
        $match: Genome.getPrefilterCondition({ user },
          {
            _id: { $in },
            'analysis.speciator.speciesId': { $exists: true },
          }),
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
        $match: Genome.getPrefilterCondition({ user },
          {
            _id: { $in },
            'analysis.speciator.speciesId': { $exists: true },
          }),
      },
      {
        $facet: taskNames.reduce((memo, task) => {
          memo[task] = [
            { $match: { [`analysis.${task}`]: { $exists: true } } },
            {
              $group: {
                _id: { speciesId: '$analysis.speciator.speciesId' },
                genomeIds: { $push: '$_id' },
                sources: { $addToSet: `$analysis.${task}.source` },
              },
            },
          ];
          return memo;
        }, {}),
      },
    ]),
  ]).then(([ organisms, [ organismsByTask ] ]) => {
    const summary = {};
    for (const organism of organisms) {
      summary[organism.speciesId] = { tasks: [], ...organism };
    }
    for (const task of Object.keys(organismsByTask)) {
      for (const { _id, genomeIds, sources } of organismsByTask[task]) {
        if (_id.speciesId in summary) {
          summary[_id.speciesId].tasks.push({ ids: genomeIds, sources, task });
        }
      }
    }
    return Object.keys(summary)
      .map((key) => summary[key])
      .filter((_) => _.tasks && _.tasks.length > 0);
  });
};
