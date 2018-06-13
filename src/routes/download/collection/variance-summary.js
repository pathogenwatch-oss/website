const es = require('event-stream');
const sanitize = require('sanitize-filename');

const Analysis = require('models/analysis');
const Genome = require('models/genome');
const Collection = require('models/collection');
const ScoreCache = require('models/scoreCache');

const { request } = require('services');
const { ServiceRequestError } = require('utils/errors');

const { calculateStats } = require('utils/stats');

function getCache(genomes, versions) {
  return ScoreCache.find(
    { fileId: { $in: genomes.map(_ => _.fileId) }, 'versions.core': versions.core, 'versions.tree': versions.tree },
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


function generateTreeStats(genomes, cache) {
  const scores = [];

  for (let a = 0; a < genomes.length; a++) {
    const genomeA = genomes[a];
    for (let b = 0; b <= a; b++) {
      const genomeB = genomes[b];
      if (a === b) {
        continue;
      } else if (genomeA.fileId === genomeB.fileId) {
        scores.push(0);
      } else if (genomeA.fileId in cache && genomeB.fileId in cache[genomeA.fileId]) {
        scores.push(cache[genomeA.fileId][genomeB.fileId]);
      } else {
        throw new ServiceRequestError(`Missing score for ${genomeA.fileId} ${genomeB.fileId}`);
      }
    }
  }

  const stats = calculateStats(scores.sort((a, b) => a - b));

  return stats;
}

async function generateTreeSites(genomes, collectionGenomeIds) {
  const sitesByFamilyId = {};
  let genomesLength = 0;

  await new Promise((resolve, reject) => {
    genomes.on('error', err => reject(err));
    genomes.on('end', () => resolve());
    genomes.on('data', genomeA => {
      genomesLength += 1;
      const isCollectionGenome = collectionGenomeIds.has(genomeA._id.toString());
      for (const profile of genomeA.analysis.core.profile) {
        if (!sitesByFamilyId[profile.id]) {
          sitesByFamilyId[profile.id] = {
            userFiltered: {},
            publicFiltered: {},
            userUnfiltered: {},
            publicUnfiltered: {},
            userRepresentative: new Set(),
            publicRepresentative: new Set(),
          };
        }

        const sites = sitesByFamilyId[profile.id];
        const filteredPositions = new Set();
        const unfilteredPositions = new Set();
        const unfilteredMutations = new Set();
        for (const allele of profile.alleles) {
          for (const position of Object.keys(allele.mutations)) {
            if (profile.filter === false && allele.filter === false) {
              filteredPositions.add(position);
            }

            unfilteredPositions.add(position);
            unfilteredMutations.add(position + allele.mutations[position]);

            sites.userFiltered[position] = 0;
            sites.publicFiltered[position] = 0;
            sites.userUnfiltered[position] = 0;
            sites.publicUnfiltered[position] = 0;
          }
        }

        for (const position of filteredPositions) {
          if (isCollectionGenome) {
            sites.userFiltered[position]++;
          }
          sites.publicFiltered[position]++;
        }

        for (const position of unfilteredPositions) {
          if (isCollectionGenome) {
            sites.userUnfiltered[position]++;
          }
          sites.publicUnfiltered[position]++;
        }

        for (const mutation of unfilteredMutations) {
          if (isCollectionGenome) {
            sites.userRepresentative.add(mutation);
          }
          sites.publicRepresentative.add(mutation);
        }
      }
    });
  });

  const result = {
    userFiltered: 0,
    publicFiltered: 0,
    userUnfiltered: 0,
    publicUnfiltered: 0,
    userRepresentative: 0,
    publicRepresentative: 0,
  };

  for (const id of Object.keys(sitesByFamilyId)) {
    const sites = sitesByFamilyId[id];

    for (const count of Object.values(sites.userFiltered)) {
      if (count > 0 && count < genomesLength) {
        result.userFiltered++;
      }
    }
    for (const count of Object.values(sites.publicFiltered)) {
      if (count > 0 && count < genomesLength) {
        result.publicFiltered++;
      }
    }
    for (const count of Object.values(sites.userUnfiltered)) {
      if (count > 0 && count < genomesLength) {
        result.userUnfiltered++;
      }
    }
    for (const count of Object.values(sites.publicUnfiltered)) {
      if (count > 0 && count < genomesLength) {
        result.publicUnfiltered++;
      }
    }

    result.userRepresentative += sites.userRepresentative.size;
    result.publicRepresentative += sites.publicRepresentative.size;
  }

  return result;
}

async function getGenomeSummaries(genomeIds) {
  const query = {
    _id: { $in: genomeIds },
  };
  const projection = {
    fileId: 1,
  };
  const options = {
    sort: { fileId: 1 },
  };
  const results = await Genome.find(query, projection, options).lean();
  return results.map(({ _id, fileId }) => ({
    _id,
    fileId,
  }));
}

function createGenomeStream(genomeSummaries, versions) {
  const fileIds = genomeSummaries.map(({ fileId }) => fileId);
  const genomeIds = genomeSummaries.reduce((acc, { fileId, _id }) => {
    acc[fileId] = acc[fileId] || [];
    acc[fileId].push(_id);
    return acc;
  }, {});

  const query = {
    fileId: { $in: fileIds },
    task: 'core',
    version: versions.core,
  };
  const projection = {
    fileId: 1,
    'results.profile.id': 1,
    'results.profile.filter': 1,
    'results.profile.alleles.filter': 1,
    'results.profile.alleles.mutations': 1,
  };
  const options = {
    sort: { fileId: 1 },
  };
  const cores = Analysis.find(query, projection, options).lean().cursor();
  const coreFormatter = es.through(function ({ fileId, results }) {
    genomeIds[fileId] = genomeIds[fileId] || [];
    for (const genomeId of genomeIds[fileId]) {
      const genome = {
        _id: genomeId,
        fileId,
        analysis: { core: results },
      };
      this.emit('data', genome);
    }
    genomeIds[fileId] = [];
  });
  return cores.pipe(coreFormatter);
}

async function generateTreeData(tree, treeGenomeIds, collectionGenomeIds) {
  const genomeSummaries = await getGenomeSummaries(treeGenomeIds);

  const cache = await getCache(genomeSummaries, tree.versions);
  const stats = generateTreeStats(genomeSummaries, cache);

  const genomes = createGenomeStream(genomeSummaries, tree.versions);
  const sites = generateTreeSites(genomes, collectionGenomeIds);

  const result = {
    label: tree.name,
    totalCollection: tree.size - tree.populationSize,
    total: tree.size,
    stats,
    sites,
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
    result.stats.min,
    result.stats.max,
    result.stats.mean,
    result.stats.stdDev,
    result.stats.median,
    result.stats.lowerQuartile,
    result.stats.upperQuartile,
    result.sites.userFiltered,
    result.sites.publicFiltered,
    result.sites.userUnfiltered,
    result.sites.publicUnfiltered,
    result.sites.userRepresentative,
    result.sites.publicRepresentative,
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
  const collectionTree = {
    name: 'collection',
    size: collectionGenomeIds.size,
    populationSize: 0,
    versions: tree.versions,
  };
  const collectionData = await generateTreeData(collectionTree, Array.from(collectionGenomeIds), collectionGenomeIds);
  writeMatrixLine(collectionData, stream);

  for (const subtree of subtrees) {
    if (subtree.status === 'READY') {
      const genomeIds = Collection.getSubtreeIds(subtree);
      const data = await generateTreeData(subtree, genomeIds, collectionGenomeIds);
      writeMatrixLine(data, stream);
    }
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
  const { token } = req.params;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'variance-summary.csv';

  res.set({
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Content-type': 'text/csv',
  });

  request('collection', 'authorise', { user, token, projection: { genomes: 1, 'tree.versions': 1, subtrees: 1 } })
    .then(results => generateMatrix(results, res))
    .catch(next);
};
