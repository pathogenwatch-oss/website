const Genome = require('models/genome');
const transform = require('stream-transform');
const sanitize = require('sanitize-filename');
const store = require('utils/object-store');

const { request } = require('services');
const { ServiceRequestError } = require('utils/errors');

async function getCollectionGenomes({ genomes }, genomeIds) {
  const query = {
    _id: { $in: genomeIds },
    $or: [
      { _id: { $in: genomes } },
      { public: true },
    ],
  };
  const projection = {
    fileId: 1,
    name: 1,
    'analysis.speciator.organismId': 1,
  };
  const result = await Genome
    .find(query, projection, { sort: { name: 1 } })
    .lean();
  return result
    .map((d) => ({ fileId: d.fileId, name: d.name, organismId: d.analysis.speciator.organismId }));
}

function writeMatrixHeader(genomes, stream) {
  const line = [ 'Name' ];
  for (const genomeA of genomes) {
    line.push(genomeA.name.replace(/,/g, '_'));
  }
  stream.write(line);
}

function generateMatrix({ genomes, cache }, stream) {
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
    stream.write(line);
  }
  stream.end();
}

module.exports = (req, res, next) => {
  const { user } = req;
  const { token, type } = req.params;
  const { ids, subtree } = req.body;

  if (!type || typeof type !== 'string') {
    res.status(400).send('`type` parameter is required.');
    return;
  }

  if (type !== 'score' && type !== 'difference') {
    res.status(400).send('Invalid `type` parameter value.');
    return;
  }

  if (subtree && typeof subtree !== 'string') {
    res.status(400).send('Invalid `subtree`.');
    return;
  }

  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || `${type}-matrix.csv`;

  const genomeIds = ids ? ids.split(',') : null;

  res.set({
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Content-type': 'text/csv',
  });

  const stream = transform((data) => `${data.join(',')}\n`);
  stream.pipe(res);

  request('collection', 'authorise', { user, token, projection: { genomes: 1, 'tree.versions': 1, 'subtrees.versions': 1, 'subtrees.name': 1 } })
    .then(async (collection) => {
      const genomes = await getCollectionGenomes(collection, genomeIds);

      writeMatrixHeader(genomes, stream);

      const tree = subtree ?
        collection.subtrees.find((_) => _.name === subtree) :
        collection.tree;

      if (!tree) {
        throw new ServiceRequestError('Tree not found');
      }

      const cache = await store.getScoreCache(genomes, tree.versions, type);
      return { genomes, cache };
    })
    .then((data) => generateMatrix(data, stream))
    .catch(next);
};
