const Genome = require('models/genome');
const ScoreCache = require('../../models/scoreCache');

const { request } = require('services');
const { ServiceRequestError } = require('utils/errors');

function getCollectionGenomes({ genomes }) {
  return Genome
    .find({ _id: { $in: genomes } }, { fileId: 1, name: 1 }, { sort: { name: 1 } })
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

function generateMatrix(genomes, cacheByFileId, stream) {
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
      } else if (genomeA.fileId in cacheByFileId && genomeB.fileId in cacheByFileId[genomeA.fileId]) {
        line.push(cacheByFileId[genomeA.fileId][genomeB.fileId]);
      } else if (genomeB.fileId in cacheByFileId && genomeA.fileId in cacheByFileId[genomeB.fileId]) {
        line.push(cacheByFileId[genomeB.fileId][genomeA.fileId]);
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

  res.set({
    'Content-Disposition': `attachment; filename="${filename}.csv"`,
    'Content-type': 'text/csv',
  });

  request('collection', 'authorise', { user, uuid, projection: { genomes: 1 } })
    .then(getCollectionGenomes)
    .then(genomes =>
      getCache(genomes, type)
        .then(cache => generateMatrix(genomes, cache, res))
    )
    .catch(next);
};
