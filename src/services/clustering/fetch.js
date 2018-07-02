const Clustering = require('../../models/clustering');
const Genome = require('../../models/genome');

async function getClusteringData({ scheme, user, sessionID }) {
  const query = { scheme };
  if (user) {
    query.user = user._id;
  }
  const projection = {
    'results.pi': 1,
    'results.lambda': 1,
    'results.sts': 1,
  };
  return await Clustering.findOne(query, projection);
}

async function mapStsToGenomeNames({ genomeId, sts, user, sessionID }) {
  const namesQuery = {
    'analysis.cgmlst.st': { $in: sts },
    ...Genome.getPrefilterCondition({ user, sessionID }),
  };
  const projection = {
    'analysis.cgmlst.st': 1,
    name: 1,
  };
  const stsAndNames = await Genome.find(namesQuery, projection).lean();
  const stNamesMap = {};
  for (const r of stsAndNames) {
    const st = r.analysis.cgmlst.st;
    const { name } = r;
    stNamesMap[st] = stNamesMap[st] || [];
    stNamesMap[st].push(name);
  }

  const genomeSt = (stsAndNames.find(_ => '' + _._id === genomeId) || {}).analysis.cgmlst.st;
  const genomeIdx = sts.indexOf(genomeSt);

  return {
    names: sts.map(st => stNamesMap[st] || [ 'Unnamed' ]),
    genomeIdx: genomeIdx === -1 ? null : genomeIdx,
  };
}

module.exports = async function ({ user, sessionID, genomeId, scheme }) {
  const clusters = await getClusteringData({ scheme, user, sessionID });
  if (!clusters) return {};

  const { results } = clusters;
  const { pi, lambda, sts = [] } = results.find(_ => _.pi); // Ignore old fashioned results with fixed thresholds
  const { names, genomeIdx } = await mapStsToGenomeNames({ genomeId, sts, user, sessionID });

  return {
    clusterIndex: { pi, lambda },
    names,
    genomeIdx,
    sts,
  };
};
