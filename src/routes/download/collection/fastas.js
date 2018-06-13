const sanitize = require('sanitize-filename');

const Genome = require('models/genome');
const { request } = require('services');
const { createFastaFileName } = require('services/utils');

function getCollectionGenomes({ genomes }, genomeIds) {
  const query = {
    _id: { $in: genomeIds },
    $or: [
      { _id: { $in: genomes } },
      { public: true },
    ],
  };
  const projection = {
    name: 1,
    fileId: 1,
  };
  const options = {
    sort: {
      name: 1,
    },
  };
  return Genome
    .find(query, projection, options);
}

function createGenomeDownload(genome, res) {
  const fileName = createFastaFileName(genome.name);
  return request('genome', 'file-path', { fileId: genome.fileId })
    .then(filePath => {
      res.set({
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-type': 'text/plain',
      });
      return res.sendFile(filePath);
    });
}

function createGenomeArchive(genomes, filename, res, next) {
  return request('download', 'create-genome-archive', { genomes })
    .then(stream => {
      stream.on('error', next);
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.setHeader('Content-Type', 'application/zip');
      stream.pipe(res);
    });
}

module.exports = (req, res, next) => {
  const { user } = req;
  const { token } = req.params;
  const { ids } = req.method === 'GET' ? req.query : req.body;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'genomes.zip';
  const genomeIds = ids ? ids.split(',') : null;

  request('collection', 'authorise', { user, token, projection: { genomes: 1 } })
    .then(collection => getCollectionGenomes(collection, genomeIds))
    .then(genomes => {
      if (genomes.length === 1) {
        createGenomeDownload(genomes[0], res);
      } else {
        createGenomeArchive(genomes, filename, res, next);
      }
    })
    .catch(next);
};
