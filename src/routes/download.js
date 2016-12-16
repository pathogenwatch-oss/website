const sanitise = require('sanitize-filename');
const path = require('path');
const express = require('express');
const router = express.Router();

const fastaStorage = require('wgsa-fasta-store');

const fileModel = require('models/file');
const assemblyModel = require('models/assembly');

const { fastaStoragePath } = require('configuration');
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

    fileModel.requestDownload(downloadRequest, (error, result) => {
      if (error) {
        return next(error);
      }
      return res.json(result);
    });
  }
);

router.get('/species/:speciesId/download/file/:fileName',
  (req, res, next) => {
    LOGGER.info(`Received request for file: ${req.params.fileName}`);

    if (!req.query.prettyFileName) {
      res.status(400).send('`prettyFileName` query parameter is required.');
      return;
    }

    res.set({
      'Content-Disposition': `attachment; filename="${req.query.prettyFileName}.zip"`,
      'Content-type': 'application/zip',
    });

    const stream = fileModel.getFile(req.params);

    stream.on('error', error => next(error));

    stream.pipe(res);
  }
);

function createFastaFileName(assemblyName = 'file') {
  return path.extname(assemblyName || '').length ?
    assemblyName :
    `${assemblyName}.fasta`;
}

router.get('/download/fasta/:id', (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    LOGGER.error('Missing id');
    return res.sendStatus(400);
  }

  LOGGER.info(`Received request for fasta: ${id}`);

  return assemblyModel.getMetadata(id).
    then(({ fileId, assemblyName }) =>
      res.set({
        'Content-Disposition': `attachment; filename="${createFastaFileName(assemblyName)}"`,
        'Content-type': 'text/plain',
      }).
      sendFile(fastaStorage.getFilePath(fastaStoragePath, fileId))
    ).
    catch(next);
});

router.post('/download/fastas', (req, res, next) => {
  const { files } = req.body;

  if (!files || !Array.isArray(files) || !files.length) {
    LOGGER.error('Invalid files list');
    return res.sendStatus(400);
  }

  LOGGER.info(`Received request for fasta zip of ${files.length} files`);

  return fastaStorage.archive(fastaStoragePath, files.map(id => sanitise(id))).
    then(fileId => res.json({ fileId })).
    catch(next);
});

router.get('/download/fasta-archive/:id', (req, res) => {
  const { id } = req.params;
  const { filename } = req.query;

  if (!id) {
    LOGGER.error('Missing id');
    return res.sendStatus(400);
  }

  LOGGER.info(`Received request for fasta archive: ${id} ${filename}`);

  const archivePath = fastaStorage.getArchivePath(fastaStoragePath, sanitise(id));

  return res.set({
    'Content-Disposition': `attachment;${filename ? ` filename="${filename}.zip"` : ''}`,
    'Content-type': 'text/plain',
  }).
  sendFile(archivePath);
});

module.exports = router;
