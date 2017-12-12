const mapLimit = require('promise-map-limit');

const Genome = require('models/genome');
const Collection = require('models/collection');
const ScoreCache = require('models/scoreCache');

const { request } = require('services');
const { ServiceRequestError } = require('utils/errors');

const { calculateStats } = require('../../utils/stats');

function getGenomes(genomeIds) {
  const query = {
    _id: { $in: genomeIds },
  };
  const projection = {
    fileId: 1,
    'analysis.core.profile.filter': 1,
  };
  const options = {
    sort: { fileId: 1 },
  };
  return Genome.find(query, projection, options).lean();
}

function getCache(genomes) {
  return ScoreCache.find(
    { fileId: { $in: genomes.map(_ => _.fileId) } },
    genomes.reduce(
      (projection, { fileId }) => {
        projection[`scores.${fileId}`] = 1;
        return projection;
      },
      { fileId: 1 }
    ),
    { sort: { fileId: 1 } }
  )
  .then(cache => {
    const cacheByFileId = {};
    for (const doc of cache) {
      cacheByFileId[doc.fileId] = doc.scores;
    }
    return cacheByFileId;
  });
}

async function generateSubtreeData(collectionGenomes, subtree) {
  const genomeIds = Collection.getSubtreeIds(subtree);
  const genomes = await getGenomes(genomeIds);
  const cache = await getCache(genomes);
  const scores = [];
  for (let a = 0; a < genomes.length; a++) {
    const genomeA = genomes[a];
    // const isPopulation = !collectionGenomes.has(id);
    for (let b = 0; b <= a; b++) {
      const genomeB = genomes[b];
      if (genomeA === genomeB) {
        scores.push(0);
      } else if (genomeA.fileId in cache && genomeB.fileId in cache[genomeA.fileId]) {
        scores.push(cache[genomeA.fileId][genomeB.fileId]);
      } else {
        throw new ServiceRequestError(`Missing score for ${genomeA.fileId} ${genomeB.fileId}`);
      }
    }
  }
  const stats = calculateStats(scores.sort());
  const result = {
    label: subtree.name,
    totalCollection: subtree.size - subtree.populationSize,
    totalPopulation: subtree.populationSize,
    minScore: stats.min,
    maxScore: stats.max,
    meanScore: stats.mean,
    stdDevScore: stats.stdDev,
    medianScore: stats.median,
    lowerQuartileScore: stats.lowerQuartile,
    upperQuartileScore: stats.upperQuartile,
  };
  return result;
}

function generateData({ genomes, subtrees }) {
  const collectionGenomes = new Set(genomes.map(id => id.toString()));
  return mapLimit(subtrees, 1, subtree => generateSubtreeData(collectionGenomes, subtree));
}

function generateMatrix(results, stream) {
  const header = [
    '',
    'Number of user assemblies',
    'Number of assemblies including public',
    'Variant Sites (user-only)',
    'Variant Sites (including public data)',
    'Minimum Pairwise Score',
    'Maximum Pairwise Score',
    'Mean Pairwise Score',
    'Pairwise Score STD Deviation',
    'Median Pairwise Score',
    'Lower Quartile Pairwise Score',
    'Upper Quartile Pairwise Score',
    'Unfiltered Variant Sites (user-only)',
    'Unfiltered Variant Sites (including public data)',
    'WGSA Gene Representative Variant Sites (user-only)',
    'WGSA Gene Representative Variant Sites (including public data)',
  ];
  stream.write(header.join(','));
  stream.write('\n');

  for (const result of results) {
    const line = [
      result.label,
      result.totalCollection,
      result.totalPopulation,
      '',
      '',
      result.minScore,
      result.maxScore,
      result.meanScore,
      result.stdDev,
      result.medianScore,
      '',
      '',
      '',
      '',
      '',
      '',
    ];
    stream.write(line.join(','));
    stream.write('\n');
  }

  stream.end();
}

module.exports = (req, res, next) => {
  const { user } = req;
  const { uuid } = req.params;
  const { filename = 'variance-summary' } = req.query;

  if (!uuid || typeof uuid !== 'string') {
    res.status(400).send('`uuid` parameter is required.');
    return;
  }

  res.set({
    'Content-Disposition': `attachment; filename="${filename}.csv"`,
    'Content-type': 'text/csv',
  });

  request('collection', 'authorise', { user, uuid, projection: { genomes: 1, subtrees: 1 } })
    .then(generateData)
    .then(results => generateMatrix(results, res))
    .catch(next);
};
