const Genome = require('models/genome');
const Organism = require('models/organism');

const { request } = require('services');

module.exports = async ({ user, genomeId, threshold }) => {
  const clusters = await request('genome', 'fetch-clusters', { user, id: genomeId });
  const thresholds = Object.keys(clusters).map(t => parseInt(t, 10));
  const clusterSizes = {};
  for (let i = 0; i < thresholds.length; i++) {
    const t = thresholds[i];
    clusterSizes[t] = clusters[t].length;
  }

  const genomeIds = clusters[threshold] || [];
  const genomes = await Genome.getForCollection({ _id: { $in: genomeIds } });
  const now = new Date().toISOString();
  let genome = {};
  for (let i = 0; i < genomes.length; i++) {
    const { _id } = genomes[i];
    if (_id && _id.toString() === genomeId) {
      genome = genomes[i];
      break;
    }
  }

  const name = genome.name || 'Unknown';
  const { speciator = {} } = genome.analysis;
  const { organismId = null } = speciator;

  const organism = await Organism.getLatest(organismId, { resistance: 1 });

  const description = `Clusters for ${name} at threshold ${threshold}`;
  return {
    clusterSizes,
    threshold,
    createdAt: now,
    description,
    genomes,
    size: genomes.length,
    tree: null,
    subtrees: [],
    title: 'Clusters',
    status: 'READY',
    organismId,
    organism,
  };
};
