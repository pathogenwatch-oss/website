const Genome = require('../../models/genome');
const { NotFoundError } = require('../../utils/errors');
const store = require('../../utils/object-store');

async function getEdges({ userId, scheme, version, sts, threshold }) {
  let value = await store.getAnalysis('cgmlst-clustering', `${version}_${scheme}`, userId, undefined);
  if (value === undefined) value = await store.getAnalysis('cgmlst-clustering', `${version}_${scheme}`, 'public', undefined);
  if (value === undefined) throw new NotFoundError(`No cluster edges at threshold ${threshold}`);

  const clusteringDoc = JSON.parse(value);
  if (clusteringDoc.threshold <= threshold) throw new NotFoundError(`No cluster edges at threshold ${threshold}`);
  for (let t=0; i<= threshold; i++) {
    if (clusteringDoc.edges[t] === undefined) throw new Error(`Edges are missing for threshold of ${t}`);
  }
  
  const clusterToQueryMap = {};
  for (let queryIdx=0; queryIdx < sts.length; queryIdx++) {
    const st = sts[queryIdx];
    const clusterIdx = clusteringDoc.STs.indexOf(st);
    if (clusterIdx === -1) throw new NotFoundError(`${st} not in clustering`);
    clusterToQueryMap[clusterIdx] = queryIdx;
  }

  const offsets = Array(nSts);
  for (let i = 1; i < nSts; i++) {
    offsets[i] = (i * (i - 1) / 2);
  }

  function edgeIndex(a, b) {
    if (a > b) {
      return offsets[a] + b;
    }
    return offsets[b] + a;
  }

  const edges = new Array(nSts * (nSts - 1) / 2).fill(false);
  for (const dist of Object.keys(clusteringDoc.edges)) {
    if (dist > threshold) continue;
    for (const [ clustA, clustB ] of clusteringDoc.edges[dist]) {
      const queryA = clusterToQueryMap[clustA];
      if (queryA === undefined) continue;
      const queryB = clusterToQueryMap[clustB];
      if (queryB === undefined) continue;
      edges[edgeIndex(queryA, queryB)] = true;
    }
  }

  return edges;
}


module.exports = async function ({ user, genomeId, scheme, version, sts, threshold }) {
  // We need to check that the user is allowed to get the edges for these STs
  const hasAccess = await Genome.checkAuthorisedForSts(user, sts);
  // We return a 404 so that we don't leak whether an ST exists for another user
  if (!hasAccess) throw new NotFoundError('Problem getting edges, maybe they binned a genome');

  // We have the distances between pairs of CGMLST STs and want to return an array showing
  // which pairs are withing `threshold` of each other.
  // If the STs are [A, B, C, D] the edges should be  ordered [AB, AC, BC, AD, BD, CD].

  // We create a function to lookup the distance between any pair of STs
  const edges = await getEdges({ userId: user ? user._id : undefined, scheme, version, sts, threshold });

  if (edges.length <= 0) {
    throw new NotFoundError(`No cluster edges found for ${genomeId} at threshold ${threshold}`);
  }

  return {
    edges,
  };
};
