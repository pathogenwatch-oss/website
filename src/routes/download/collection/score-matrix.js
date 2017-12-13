const Genome = require('models/genome');
const ScoreCache = require('models/scoreCache');

const { request } = require('services');
const { ServiceRequestError } = require('utils/errors');

function getCollectionGenomes({ genomes }, genomeIds) {
  const query = {
    _id: { $in: genomeIds },
    $or: [
      { _id: { $in: genomes } },
      { public: true },
    ],
  };
  return Genome
    .find(query, { fileId: 1, name: 1 }, { sort: { name: 1 } })
    .lean();
}

function getCache(genomes, type) {
  const fieldName = (type === 'score') ? 'scores' : 'differences';
  return ScoreCache.find(
    { fileId: { $in: genomes.map(_ => _.fileId) } },
    genomes.reduce(
      (projection, { fileId }) => {
        projection[`${fieldName}.${fileId}`] = 1;
        return projection;
      },
      { fileId: 1 }
    ),
    { sort: { fileId: 1 } }
  )
  .then(cache => {
    const cacheByFileId = {};
    for (const doc of cache) {
      cacheByFileId[doc.fileId] = doc[fieldName];
    }
    return cacheByFileId;
  });
}

function generateMatrix({ genomes, cache }, stream) {
  {
    const line = [ 'Name' ];
    for (const genomeA of genomes) {
      line.push(genomeA.name.replace(/,/g, '_'));
    }
    stream.write(line.join(','));
    stream.write('\n');
  }

  for (const genomeA of genomes) {
    const line = [ genomeA.name.replace(/,/g, '_') ];
    for (const genomeB of genomes) {
      if (genomeA === genomeB) {
        line.push(0);
      } else if (genomeA.fileId in cache && genomeB.fileId in cache[genomeA.fileId]) {
        line.push(cache[genomeA.fileId][genomeB.fileId]);
      } else if (genomeB.fileId in cache && genomeA.fileId in cache[genomeB.fileId]) {
        line.push(cache[genomeB.fileId][genomeA.fileId]);
      } else {
        throw new ServiceRequestError(`Missing score for ${genomeA.fileId} ${genomeB.fileId}`);
      }
    }
    stream.write(line.join(','));
    stream.write('\n');
  }

  stream.end();
}

module.exports = (req, res, next) => {
  const { user } = req;
  const { uuid, type } = req.params;
  const { ids } = req.body;
  const { filename = `${type}-matrix` } = req.query;

  if (!type || typeof type !== 'string') {
    res.status(400).send('`type` parameter is required.');
    return;
  }

  if (type !== 'score' && type !== 'difference') {
    res.status(400).send('Invalid `type` parameter value.');
    return;
  }

  if (!uuid || typeof uuid !== 'string') {
    res.status(400).send('`uuid` parameter is required.');
    return;
  }

  if (ids && typeof ids !== 'string') {
    res.status(400).send('`ids` parameter is invalid.');
    return;
  }
  const genomeIds = ids ? ids.split(',') : null;

  res.set({
    'Content-Disposition': `attachment; filename="${filename}.csv"`,
    'Content-type': 'text/csv',
  });

  request('collection', 'authorise', { user, uuid, projection: { genomes: 1 } })
    .then(async (collection) => {
      const genomes = await getCollectionGenomes(collection, genomeIds);
      const cache = await getCache(genomes, type);
      return { genomes, cache };
    })
    .then(data => generateMatrix(data, res))
    .catch(next);
};
