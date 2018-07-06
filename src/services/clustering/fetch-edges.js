const Clustering = require('../../models/clustering');
const Genome = require('../../models/genome');

async function getClusteringData({ scheme, user }) {
  const query = { scheme };
  if (user) {
    query.user = user._id;
  } else {
    query.public = true;
  }
  const projection = {
    'results.sts': 1,
    'results.distances': 1,
  };
  return await Clustering.findOne(query, projection);
}

const createDistanceLookup = (distances, sts) => {
  const stMap = {};
  for (let i = 0; i < sts.length; i++) {
    const st = sts[i];
    stMap[st] = sts.indexOf(st);
  }
  return (stA, stB) => {
    const [ _a, _b ] = [ stMap[stA], stMap[stB] ];
    const [ a, b ] = _a < _b ? [ _a, _b ] : [ _b, _a ];
    if (a === -1 || b === -1 || a === b) throw new Error(`Distance between ${stA} and ${stB} is missing`);
    const startOffset = b * (b - 1) / 2;
    const offset = startOffset + a;
    return distances[offset];
  };
};

module.exports = async function ({ user, genomeId, sts, threshold }) {
  const scheme = await Genome.lookupCgMlstScheme(genomeId, user);
  if (!scheme) return {};
  const clusters = await getClusteringData({ scheme, user });
  if (!clusters) return {};

  const { results } = clusters;
  const { distances: allDistances, sts: allSts = null } = results.find(_ => _.distances) || {}; // Ignore old fashioned results with fixed thresholds
  if (!allSts) return {};

  // distances contains the distance between 2 CGMLST STs. If the STs are [A, B, C, D] the distances are
  // ordered [AB, AC, BC, AD, BD, CD].  The frontend is generally only interested in a subset of distances
  // for a selection of sts.

  // We create a function to lookup the distance between any pair of STs
  const distanceLookup = createDistanceLookup(allDistances, allSts);
  const edges = [];
  for (let a = 1; a < sts.length; a++) {
    const stA = sts[a];
    for (let b = 0; b < a; b++) {
      const stB = sts[b];
      // We're just going to return 1 if there's an edge between two STs or 0 if there isn't
      edges.push(distanceLookup(stA, stB) <= threshold ? 1 : 0);
    }
  }

  return {
    edges,
  };
};
