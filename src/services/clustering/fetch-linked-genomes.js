const { request } = require('services');
const Genome = require('models/genome');
const { ServiceRequestError } = require("../../../services/errors");

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

module.exports = async ({ user, scheme, version, id, threshold = 0, filters = {} }) => {
  if (!id) throw new ServiceRequestError('Missing Id');
  if (!user) throw new ServiceRequestError('Missing User');

  const clusteringData = await request('clustering', 'fetch', { user, scheme, id });
  const { clusterIndex, genomeIdx, sts: allSts } = clusteringData;

  // Extract all linked cgSTs that are linked to the query genome ID
  const clusters = buildClusters(threshold, clusterIndex);
  const sts = allSts.filter((_, i) => clusters[i] === clusters[genomeIdx]);

  const idQuery = {
    'analysis.cgmlst.st': { $in: sts },
    ...Genome.getPrefilterCondition({ user }),
  };

  const query = {
    id: [],
    ...filters,
  };

  // Get the uuids
  for (const genome of await Genome.find(idQuery, { _id: 1 })) {
    query.id.push(genome._id.toString());
  }
  // Return the expected format for the lisst view.
  const genomeList = await request('genome', 'fetch-list', { user, scheme, query });
  return genomeList;
};
