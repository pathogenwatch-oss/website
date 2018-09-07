const Genome = require('models/genome');
const Organism = require('models/organism');

const { request } = require('services');

function buildClusters(threshold, clusterIndex) {
  const { pi, lambda } = clusterIndex;
  const nItems = pi.length;
  const clusters = pi.map(() => 0);
  for (let i = nItems - 1; i >= 0; i--) {
    if (lambda[i] > threshold) clusters[i] = i;
    else clusters[i] = clusters[pi[i]];
  }
  return clusters;
}

module.exports = async ({ user, genomeId, threshold }) => {
  const clusteringData = await request('genome', 'fetch-clusters', { user, id: genomeId });
  const { clusterIndex, genomeIdx, sts: allSts } = clusteringData;

  // FIXME: we should probably do this in the frontend so that we don't keep downloading
  // the same data whenever someone changes a threshold a little bit.
  const clusters = buildClusters(threshold, clusterIndex);
  const sts = allSts.filter((_, i) => clusters[i] === clusters[genomeIdx]);

  const query = {
    'analysis.cgmlst.st': { $in: sts },
    ...Genome.getPrefilterCondition({ user }),
  };
  const genomes = await Genome.getForCollection(query);

  const now = new Date().toISOString();
  const genome = genomes.find(_ => _._id && _._id.toString() === genomeId);
  const name = genome.name || 'Unknown';
  const { speciator = {} } = genome.analysis;
  const { organismId = null } = speciator;

  const title = `Clusters for ${name}`;
  return {
    createdAt: now,
    genomes,
    organismId,
    size: genomes.length,
    status: 'READY',
    subtrees: [],
    threshold,
    title,
    tree: null,
  };
};
