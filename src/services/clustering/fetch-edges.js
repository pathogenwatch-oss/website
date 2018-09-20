const Clustering = require('../../models/clustering');
const Genome = require('../../models/genome');
const { NotFoundError } = require('../../utils/errors');
const { Writable } = require('stream');

async function getClusteringData({ userId, scheme, version, sts, threshold }) {
  const query = {
    scheme,
    version,
    $or: [ { user: userId }, { public: true } ],
    threshold: { $gte: threshold },
    'STs.1': { $exists: 1 },
  };
  const projection = { STs: 1, public: 1, relatedBy: 1 };

  const [ clusteringDoc ] = await Clustering
    .find(
      query,
      projection,
    )
    .sort({ public: 1 })
    .limit(1)
    .lean();

  if (!clusteringDoc) {
    throw new NotFoundError(`No cluster edges at threshold ${threshold}`);
  }
  const clusterSts = new Set(clusteringDoc.STs);
  for (const st of sts) {
    if (!clusterSts.has(st)) {
      throw new NotFoundError(`No cluster edges found for st ${st} at threshold ${threshold}`);
    }
  }

  const stLookup = {};
  for (let i = 0; i < clusteringDoc.STs.length; i++) {
    stLookup[clusteringDoc.STs[i]] = i;
  }

  const hasEdge = {};
  const seen = new Set();

  let onGotEdges;
  let onFailedEdges;
  const whenGotEdges = new Promise((resolve, reject) => {
    onGotEdges = resolve;
    onFailedEdges = reject;
  });
  const consumer = new Writable({
    objectMode: true,
    write(doc, _, callback) {
      if (!doc) return callback();
      for (const dist of Object.keys(doc.edges)) {
        if (dist > threshold) continue;
        if (seen.has(dist)) {
          return callback(new Error(`Already seen distances of ${dist}`));
        }
        for (const [ a, b ] of doc.edges[dist]) {
          const [ min_, max_ ] = a < b ? [ a, b ] : [ b, a ];
          hasEdge[min_] = hasEdge[min_] || {};
          hasEdge[min_][max_] = true;
        }
        seen.add(dist);
      }
      return callback();
    },
    final(callback) {
      onGotEdges();
      return callback();
    },
  });

  Clustering
    .find({ relatedBy: clusteringDoc.relatedBy }, { edges: 1 })
    .lean()
    .cursor()
    .pipe(consumer)
    .on('error', err => onFailedEdges(err));

  await whenGotEdges;
  for (let t = 0; t <= threshold; t++) {
    if (!seen.has(t.toString())) {
      throw new Error(`Edges are missing for threshold of ${t}`);
    }
  }

  return (stA, stB) => {
    if (stA === stB) return 0;
    const a = stLookup[stA];
    const b = stLookup[stB];
    if (a === undefined) throw new NotFoundError(`No cluster for st ${stA}`);
    if (b === undefined) throw new NotFoundError(`No cluster for st ${stB}`);
    const [ min_, max_ ] = a < b ? [ a, b ] : [ b, a ];
    return !!(hasEdge[min_] || {})[max_];
  };
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
  const lookup = await getClusteringData({ userId: user._id, scheme, version, sts, threshold });

  const edges = [];
  for (let a = 1; a < sts.length; a++) {
    const stA = sts[a];
    for (let b = 0; b < a; b++) {
      const stB = sts[b];
      // We're just going to return 1 if there's an edge between two STs or 0 if there isn't
      edges.push(lookup(stA, stB));
    }
  }

  if (edges.length <= 0) {
    throw new NotFoundError(`No cluster edges found for ${genomeId} at threshold ${threshold}`);
  }

  return {
    edges,
  };
};
