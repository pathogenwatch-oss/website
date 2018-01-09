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
    'analysis.core.profile.alleles.filter': 1,
    'analysis.core.profile.alleles.mutations': 1,
  };
  const options = {
    sort: { fileId: 1 },
  };
  return Genome.find(query, projection, options).lean();
}

function getCache(genomes, { version }) {
  return ScoreCache.find(
    { fileId: { $in: genomes.map(_ => _.fileId) }, version },
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

async function generateTreeData(tree, collectionGenomeIds) {
  const genomeIds = Collection.getSubtreeIds(tree);
  const genomes = await getGenomes(genomeIds);
  const cache = await getCache(genomes, tree);
  const scores = [];
  let userVariantSites = 0;
  let publicVariantSites = 0;
  let userUnfilteredVariantSites = 0;
  let publicUnfilteredVariantSites = 0;
  const uniqueUserVariantSites = {};
  const uniquePublicVariantSites = {};
  for (let a = 0; a < genomes.length; a++) {
    const genomeA = genomes[a];
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

    const isCollectionGenome = collectionGenomeIds.has(genomeA._id.toString());
    for (const profile of genomeA.analysis.core.profile) {
      if (!uniqueUserVariantSites[profile.id]) {
        uniqueUserVariantSites[profile.id] = new Set();
      }
      if (!uniquePublicVariantSites[profile.id]) {
        uniquePublicVariantSites[profile.id] = new Set();
      }
      for (const allele of profile.alleles) {
        for (const site of Object.keys(allele.mutations)) {
          if (profile.filter === false && allele.filter === false) {
            if (isCollectionGenome) {
              userVariantSites++;
              uniqueUserVariantSites[profile.id].add(site);
            }
            publicVariantSites++;
            uniquePublicVariantSites[profile.id].add(site);
          }
          if (isCollectionGenome) {
            userUnfilteredVariantSites++;
          }
          publicUnfilteredVariantSites++;
        }
      }
    }
  }
  const stats = calculateStats(scores.sort());
  let userRepresentativeVariantSites = 0;
  for (const id of Object.keys(uniqueUserVariantSites)) {
    userRepresentativeVariantSites += uniqueUserVariantSites[id].size;
  }
  let publicRepresentativeVariantSites = 0;
  for (const id of Object.keys(uniquePublicVariantSites)) {
    publicRepresentativeVariantSites += uniquePublicVariantSites[id].size;
  }
  const result = {
    label: tree.name,
    totalCollection: tree.size - tree.populationSize,
    total: tree.size,
    minScore: stats.min,
    maxScore: stats.max,
    meanScore: stats.mean,
    stdDevScore: stats.stdDev,
    medianScore: stats.median,
    lowerQuartileScore: stats.lowerQuartile,
    upperQuartileScore: stats.upperQuartile,
    userVariantSites,
    publicVariantSites,
    userUnfilteredVariantSites,
    publicUnfilteredVariantSites,
    userRepresentativeVariantSites,
    publicRepresentativeVariantSites,
  };
  return result;
}

function writeMatrixHeader(stream) {
  const header = [
    '',
    'Number of user assemblies',
    'Number of assemblies including public',
    'Minimum Pairwise Score',
    'Maximum Pairwise Score',
    'Mean Pairwise Score',
    'Pairwise Score STD Deviation',
    'Median Pairwise Score',
    'Lower Quartile Pairwise Score',
    'Upper Quartile Pairwise Score',
    'Variant Sites (user-only)',
    'Variant Sites (including public data)',
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
    result.minScore,
    result.maxScore,
    result.meanScore,
    result.stdDevScore,
    result.medianScore,
    result.lowerQuartileScore,
    result.upperQuartileScore,
    result.userVariantSites,
    result.publicVariantSites,
    result.userUnfilteredVariantSites,
    result.publicUnfilteredVariantSites,
    result.userRepresentativeVariantSites,
    result.publicRepresentativeVariantSites,
  ];
  stream.write(line.join(','));
  stream.write('\n');
}

function writeMatrixFooter(stream) {
  stream.write('\n');
  stream.write('Notes:1. WGSA Gene Representative Sites includes sites that vary when compared to the WGSA family reference alleles');
  stream.write('\n');
}

async function generateData({ genomes, tree, subtrees }, stream) {
  const collectionGenomeIds = new Set(genomes.map(id => id.toString()));
  // const collectionData = await generateTreeData('collection', collectionGenomes.length, 0, collectionGenomes);
  // writeMatrixLine(collectionData, stream);

  for (const subtree of subtrees) {
    const data = await generateTreeData(subtree, collectionGenomeIds);
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

  request('collection', 'authorise', { user, uuid, projection: { genomes: 1, 'tree.version': 1, subtrees: 1 } })
    .then(results => generateMatrix(results, res))
    .catch(next);
};
