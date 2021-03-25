const Genome = require('../../models/genome');
const { NotFoundError } = require('../../utils/errors');
const store = require('../../utils/object-store');

async function getClusteringData({ scheme, user }) {
  let value
  if (user) value = await store.getAnalysis('cgmlst-clustering', `${version}_${scheme}`, user._id, undefined);
  if (value === undefined) value = await store.getAnalysis('cgmlst-clustering', `${version}_${scheme}`, 'public', undefined);
  if (value === undefined) return undefined;
  
  const { edges, ...doc } = JSON.parse(value);
  return doc
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
