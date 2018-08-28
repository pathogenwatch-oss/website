const ClusteringCache = require('../../models/clusteringCache');
const Genome = require('../../models/genome');
const { NotFoundError } = require('../../utils/errors');

async function getClusteringData({ scheme, version, sts }) {
  const query = { scheme, version, st: { $in: sts } };
  const projection = { st: 1 };
  for (const st of sts) {
    projection[`alleleDifferences.${st}`] = 1;
  }
  const docs = await ClusteringCache.find(query, projection).lean();
  const lookup = {};
  for (const doc of docs) {
    for (const otherSt of Object.keys(doc.alleleDifferences || {})) {
      const distance = doc.alleleDifferences[otherSt];
      const [ stA, stB ] = doc.st < otherSt ? [ doc.st, otherSt ] : [ otherSt, doc.st ];
      lookup[stA] = lookup[stA] || {};
      lookup[stA][stB] = distance;
    }
  }
  return (stA, stB) => {
    if (stA === stB) return 0;
    try {
      return stA < stB ? lookup[stA][stB] : lookup[stB][stA];
    } catch (e) {
      throw new NotFoundError('Problem getting edges');
    }
  };
}


module.exports = async function ({ user, scheme, version, sts, threshold }) {
  // We need to check that the user is allowed to get the edges for these STs
  const hasAccess = await Genome.checkAuthorisedForSts(user, sts);
  // We return a 404 so that we don't leak whether an ST exists for another user
  if (!hasAccess) throw new NotFoundError('Problem getting edges');

  // We have the distances between pairs of CGMLST STs and want to return an array showing
  // which pairs are withing `threshold` of each other.
  // If the STs are [A, B, C, D] the edges should be  ordered [AB, AC, BC, AD, BD, CD].

  // We create a function to lookup the distance between any pair of STs
  const lookup = await getClusteringData({ scheme, version, sts });

  const edges = [];
  for (let a = 1; a < sts.length; a++) {
    const stA = sts[a];
    for (let b = 0; b < a; b++) {
      const stB = sts[b];
      // We're just going to return 1 if there's an edge between two STs or 0 if there isn't
      edges.push(lookup(stA, stB) <= threshold ? 1 : 0);
    }
  }

  return {
    edges,
  };
};
