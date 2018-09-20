const Clustering = require('../../models/clustering');
const Genome = require('../../models/genome');
const { NotFoundError } = require('../../utils/errors');

async function getClusteringData({ scheme, user }) {
  const query = { scheme, 'STs.1': { $exists: true } };
  if (user) {
    query.user = user._id;
  } else {
    query.public = true;
  }
  const projection = {
    pi: 1,
    lambda: 1,
    STs: 1,
    version: 1,
    threshold: 1,
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

  const foundSts = new Set(Object.keys(nodes));
  for (const st of sts) {
    if (!foundSts.has(st)) throw new NotFoundError(`User nolonger has a genome with st ${st}`);
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

  const { pi, lambda, STs: sts = [], threshold, version } = clusters;
  if (sts.length === 0) {
    throw new NotFoundError('No matching clustering result');
  }

  const { nodes, genomeIdx } = await mapStsToGenomeNames({ genomeId, sts, user });

  return {
    clusterIndex: { pi, lambda },
    nodes,
    genomeIdx,
    sts,
    scheme,
    version,
    threshold,
  };
};
