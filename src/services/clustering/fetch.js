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
  const genomes = await Genome.find(namesQuery, projection).lean();

  const nodes = {};
  for (const r of genomes) {
    const st = r.analysis.cgmlst.st;
    const { _id, name } = r;

    if (!(st in nodes)) {
      nodes[st] = { label: name, ids: [] };
    }
    nodes[st].ids.push(_id);
  }

  const genome = genomes.find(_ => _._id.toString() === genomeId);
  const genomeSt = genome ? genome.analysis.cgmlst.st : null;
  const genomeIdx = sts.indexOf(genomeSt);

  nodes[genomeSt].label = genome.name;

  if (genomeIdx === -1) {
    throw new NotFoundError(`Genome ${genomeId} was not found in clusters`);
  }

  return {
    nodes,
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
  const { nodes, genomeIdx } = await mapStsToGenomeNames({ genomeId, sts, user });

  return {
    clusterIndex: { pi, lambda },
    nodes,
    genomeIdx,
    sts,
    scheme,
    version,
  };
};
