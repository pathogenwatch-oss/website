const Clustering = require('../../models/clustering');

module.exports = async function ({ user, sessionID, genomeId, scheme }) {
  const query = { scheme };
  if (user) {
    query.user = user._id;
  } else if (sessionID) {
    query.sessionID = sessionID;
  }
  const clusters = await Clustering.findOne(query);
  if (!clusters) return {};
  const { results } = clusters;

  const outputClusters = {};
  let clusterId = null;
  for (let i = 0; i < results.length; i++) {
    const { threshold, genomes } = results[i];
    for (let j = 0; j < genomes.length; j++) {
      const { genome, cluster } = genomes[j];
      if (genome === genomeId) {
        clusterId = cluster;
        break;
      }
    }
    if (clusterId === null) continue;
    outputClusters[threshold] = [];
    for (let j = 0; j < genomes.length; j++) {
      const { genome, cluster } = genomes[j];
      if (cluster === clusterId) {
        outputClusters[threshold].push(genome);
      }
    }
  }
  return outputClusters;
};
