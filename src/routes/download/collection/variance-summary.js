const mapLimit = require('promise-map-limit');

const Genome = require('models/genome');
const Collection = require('models/collection');
const ScoreCache = require('models/scoreCache');

const { request } = require('services');
const { ServiceRequestError } = require('utils/errors');

const { calculateStats } = require('utils/stats');

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

async function generateTreeData(label, totalCollection, totalPopulation, genomeIds) {
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
    label,
    totalCollection,
    total: totalCollection + totalPopulation,
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

function writeMatrixHeader(stream) {
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
}

function writeMatrixLine(result, stream) {
  const line = [
    result.label.replace(/,/g, ''),
    result.totalCollection,
    result.total,
    '',
    '',
    result.minScore,
    result.maxScore,
    result.meanScore,
    result.stdDevScore,
    result.medianScore,
    result.lowerQuartileScore,
    result.upperQuartileScore,
    '',
    '',
    '',
    '',
  ];
  stream.write(line.join(','));
  stream.write('\n');
}

function writeMatrixFooter(stream) {
  stream.write('\n');
  stream.write('Notes:1. WGSA Gene Representative Sites includes sites that vary when compared to the WGSA family reference alleles');
  stream.write('\n');
}

async function generateData({ genomes, subtrees }, stream) {
  // const collectionGenomes = genomes.map(id => id.toString());
  // const collectionData = await generateTreeData('collection', collectionGenomes.length, 0, collectionGenomes);
  // writeMatrixLine(collectionData, stream);

  for (const tree of subtrees) {
    const genomeIds = Collection.getSubtreeIds(tree);
    const data = await generateTreeData(tree.name, tree.size - tree.populationSize, tree.populationSize, genomeIds);
    writeMatrixLine(data, stream);
  }
}

async function generateMatrix(collection, stream) {
  writeMatrixHeader(stream);
  await generateData(collection, stream);
  writeMatrixFooter(stream);
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
    .then(results => generateMatrix(results, res))
    .catch(next);
};
