const Clustering = require('../../models/clustering');
const Genome = require('../../models/genome');
const { NotFoundError } = require('../../utils/errors');
const { Writable } = require('stream');

async function getEdges({ userId, scheme, version, sts, threshold }) {
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
  const clusterToQueryMap = {};
  let checkCount = 0;
  let checkSum = 0;
  for (let clusterIdx = 0; clusterIdx < clusteringDoc.STs.length; clusterIdx++) {
    const st = clusteringDoc.STs[clusterIdx];
    const queryIdx = sts.indexOf(st);
    if (queryIdx === -1) continue;
    clusterToQueryMap[clusterIdx] = queryIdx;
    checkCount++;
    checkSum += queryIdx;
  }

  const nSts = sts.length;
  if (checkCount !== nSts || checkSum !== (nSts * (nSts - 1) / 2)) {
    throw new NotFoundError('No cluster edges some of the query sts');
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
        for (const [ clustA, clustB ] of doc.edges[dist]) {
          const queryA = clusterToQueryMap[clustA];
          if (queryA === undefined) continue;
          const queryB = clusterToQueryMap[clustB];
          if (queryB === undefined) continue;
          edges[edgeIndex(queryA, queryB)] = true;
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

  const thresholdsQuery = [];
  const thresholdProjection = {};
  for (let t = 0; t <= threshold; t++) {
    thresholdsQuery.push({ [`edges.${t}`]: { $exists: true } });
    thresholdProjection[`edges.${t}`] = 1;
  }
  Clustering
    .find({ relatedBy: clusteringDoc.relatedBy, $or: thresholdsQuery }, thresholdProjection)
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
