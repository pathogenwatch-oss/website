const Genome = require('models/genome');
const { NotFoundError } = require('utils/errors');
const { request } = require('services');
const { getClusteringTask } = require('manifest');

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
    if (!foundSts.has(st)) throw new NotFoundError(`User no longer has a genome with st ${st}`);
  }

  const genome = genomes.find((_) => _._id.toString() === genomeId);
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

module.exports = async function ({ user = {}, scheme, organismId, id: genomeId }) {
  const { version } = getClusteringTask(scheme);
  if (version === undefined) throw new NotFoundError('No matching clustering result');

  const clusters = await request('clustering', 'cluster-details', { scheme, version, organismId, userId: user._id });
  if (!clusters) {
    throw new NotFoundError('No matching clustering result');
  }

  const { pi, lambda, STs: sts = [], threshold } = clusters;
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
