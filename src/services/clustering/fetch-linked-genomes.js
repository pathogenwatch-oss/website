const { request } = require('services');
const Genome = require('models/genome');
const { getClusteringTask } = require("manifest");
const { ServiceRequestError, NotFoundError } = require("../../../services/errors");
const { maxContextOutputSize } = require("../../../defaults");
const { messageToken } = require("../../../universal/constants");

function buildClusters({ pi, lambda }, threshold) {
  const nItems = pi.length;
  const clusters = pi.map(() => 0);
  for (let i = nItems - 1; i >= 0; i--) {
    if (lambda[i] > threshold) clusters[i] = i;
    else clusters[i] = clusters[pi[i]];
  }
  return clusters;
}

async function fetchClusters(user, scheme) {
  const { version } = getClusteringTask(scheme);
  if (version === undefined) throw new NotFoundError('No matching clustering result');

  const message = { scheme, version };
  if (!!user) message.userId = user._id;

  const clusters = await request('clustering', 'cluster-details', message);
  if (!clusters) {
    throw new NotFoundError('No matching clustering result');
  }
  return clusters;
}

module.exports = async ({ user, scheme, id, threshold = 0, filters = {} }) => {
  if (!id) throw new ServiceRequestError('Missing Id');

  // Get the cluster document.
  const clustering = await fetchClusters(user, scheme);
  if (threshold > clustering.threshold) throw new ServiceRequestError(`${messageToken}Threshold of ${threshold} is greater than the maximum allowed (${clustering.threshold})`);
  const genomes = Genome.find({
    'analysis.cgmlst.st': { $in: clustering.STs },
    ...Genome.getPrefilterCondition({ user }),
  },
  { 'analysis.cgmlst.st': 1 });
  const querySTs = {};
  const queryIds = [].concat(id);

  const nodes = {};
  for (const genome of await genomes) {
    const st = genome.analysis.cgmlst.st;
    const { _id } = genome;
    if (queryIds.includes(_id.toString())) {
      querySTs[_id] = st;
    }
    if (!(st in nodes)) {
      nodes[st] = [];
    }
    nodes[st].push(_id);
  }
  // Create an index of ST to genome ID
  const stIndex = {};
  for (const queryId of queryIds) {
    stIndex[queryId] = clustering.STs.indexOf(querySTs[queryId]);
  }

  // Use to extract the linked sts for each genome
  const clusters = buildClusters(clustering, threshold);
  const seen = new Set();
  const aggregateIdentifiers = [];
  for (const queryId of queryIds) {
    const sts = clustering.STs.filter((_, i) => clusters[i] === clusters[stIndex[queryId]]);
    for (const st of sts) {
      if (seen.has(st)) continue;
      seen.add(st);
      aggregateIdentifiers.push(...nodes[st]);
    }
  }

  if (aggregateIdentifiers.length > maxContextOutputSize) throw new ServiceRequestError(`${messageToken}Too many genomes in response: ${aggregateIdentifiers.length} (max: ${maxContextOutputSize})`);

  const query = {
    ...filters,
    id: aggregateIdentifiers,
    limit: aggregateIdentifiers.length,
  };

  // Return the expected format for the list view.
  const genomeList = await request('genome', 'fetch-list', { user, scheme, query });
  return genomeList;
};
