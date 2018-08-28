const Clustering = require('../../models/clustering');
const Genome = require('../../models/genome');
const { NotFoundError } = require('../../utils/errors');

async function getClusteringData({ scheme, user }) {
  const query = { scheme };
  if (user) {
    query.user = user._id;
  } else {
    query.public = true;
  }
  const projection = {
    'results.pi': 1,
    'results.lambda': 1,
    'results.sts': 1,
    version: 1,
  };
  return await Clustering.findOne(query, projection);
}

async function mapStsToGenomeNames({ genomeId, sts, user }) {
  const namesQuery = {
    'analysis.cgmlst.st': { $in: sts },
    ...Genome.getPrefilterCondition({ user }),
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

  const genome = stsAndNames.find(_ => _._id.toString() === genomeId);
  const genomeSt = genome ? genome.analysis.cgmlst.st : null;
  const genomeIdx = sts.indexOf(genomeSt);

  if (genomeIdx === -1) {
    throw new NotFoundError(`Genome ${genomeId} was not found in clusters`);
  }

  return {
    names: sts.map(st => stNamesMap[st] || [ 'Unnamed' ]),
    genomeIdx,
  };
}

module.exports = async function ({ user, genomeId }) {
  const scheme = await Genome.lookupCgMlstScheme(genomeId, user);
  const clusters = await getClusteringData({ scheme, user });
  if (!clusters) {
    throw new NotFoundError('No matching clustering result');
  }

  const { results, version } = clusters;
  const result = results.find(_ => _.pi); // Ignore old fashioned results with fixed thresholds
  if (!result) {
    throw new NotFoundError('No matching clustering result');
  }

  const { pi, lambda, sts = [] } = result;
  const { names, genomeIdx } = await mapStsToGenomeNames({ genomeId, sts, user });

  return {
    clusterIndex: { pi, lambda },
    names,
    genomeIdx,
    sts,
    scheme,
    version,
  };
};
