const path = require('path');
const express = require('express');
const router = express.Router();

const services = require('services');
const CollectionGenome = require('data/collectionGenome');

const LOGGER = require('utils/logging').createLogger('Download requests');

router.post('/species/:speciesId/download/type/:idType/format/:fileFormat',
  (req, res, next) => {
    const downloadRequest = {
      idType: req.params.idType,
      format: req.params.fileFormat,
      idList: req.body.idList,
      speciesId: req.params.speciesId,
    };

    LOGGER.info(
      `Received request for download: ${downloadRequest.idType}, ${downloadRequest.format}`
    );

    services.request('backend', 'request-download', { request: downloadRequest }).
      then(result => res.json(result)).
      catch(error => next(error));
  }
);

router.get('/species/:speciesId/download/file/:filename',
  (req, res, next) => {
    const { filename } = req.params;
    LOGGER.info(`Received request for file: ${filename}`);

    if (!req.query.prettyFileName) {
      res.status(400).send('`prettyFileName` query parameter is required.');
      return;
    }

    res.set({
      'Content-Disposition': `attachment; filename="${req.query.prettyFileName}.zip"`,
      'Content-type': 'application/zip',
    });

    services.request('download', 'get-file', { filename }).
      then(stream => {
        stream.on('error', error => next(error));

        stream.pipe(res);
      }).
      catch(error => next(error));
  }
);

function createFastaFileName(assemblyName = 'file') {
  return path.extname(assemblyName || '').length ?
    assemblyName :
    `${assemblyName}.fasta`;
}

router.get('/download/genome/:id', (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    LOGGER.error('Missing id');
    return res.sendStatus(400);
  }

  LOGGER.info(`Received request for fasta: ${id}`);

  return CollectionGenome.findById(id).
    then(({ fileId, name }) => {
      res.set({
        'Content-Disposition': `attachment; filename="${createFastaFileName(name)}"`,
        'Content-type': 'text/plain',
      });
      return services.request('genome', 'file-path', { fileId });
    }).
    then(filePath => res.sendFile(filePath)).
    catch(next);
});

router.put('/download/genome-archive', (req, res, next) => {
  const { type, ids } = req.body;

  LOGGER.info(`Received request for ${type} archive of ${ids.length} files`);

  return services.request('download', 'create-genome-archive', { type, ids }).
    then(fileId => res.json({ fileId })).
    catch(next);
});

router.get('/download/genome-archive/:id', (req, res) => {
  const { id } = req.params;
  const { filename } = req.query;

  LOGGER.info(`Received request for fasta archive: ${id} ${filename}`);

  res.set({
    'Content-Disposition': `attachment;${filename ? ` filename="${filename}.zip"` : ''}`,
    'Content-type': 'text/plain',
  });

  services.request('download', 'genome-archive-path', { id }).
    then(archivePath => res.sendFile(archivePath));
});

module.exports = router;
