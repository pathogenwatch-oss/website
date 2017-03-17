const express = require('express');
const router = express.Router();

const services = require('services');

const LOGGER = require('utils/logging').createLogger('Downloads');

router.get('/file/:filename',
  (req, res, next) => {
    const { filename } = req.params;
    LOGGER.info(`Received request for file: ${filename}`);

    if (!req.query.filename) {
      res.status(400).send('`filename` query parameter is required.');
      return;
    }

    res.set({
      'Content-Disposition': `attachment; filename="${req.query.filename}.zip"`,
      'Content-type': 'application/zip',
    });

    services.request('download', 'get-file', { filename }).
      then(stream => {
        stream.on('error', error => next(error));

        stream.pipe(res);
      }).
      catch(next);
  }
);

router.get('/genome/:id', (req, res, next) => {
  const { user, params, query, sessionID } = req;
  const { id } = params;
  const { type } = query;

  if (!id) {
    LOGGER.error('Missing id');
    return res.sendStatus(400);
  }

  LOGGER.info(`Received request for fasta: ${id}`);

  return services.request('genome', 'download', { user, sessionID, type, id }).
    then(({ filePath, fileName }) => {
      res.set({
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-type': 'text/plain',
      });
      return res.sendFile(filePath);
    }).
    catch(next);
});

router.put('/genome-archive', (req, res, next) => {
  const { user, sessionID } = req;
  const { type, ids } = req.body;

  LOGGER.info(`Received request for ${type} archive of ${ids.length} files`);

  return services.request('download', 'create-genome-archive', { user, sessionID, type, ids })
    .then(fileId => res.json({ fileId }))
    .catch(next);
});

router.get('/genome-archive/:id', (req, res, next) => {
  const { user, sessionID } = req;
  const { id } = req.params;
  const { filename } = req.query;

  LOGGER.info(`Received request for fasta archive: ${id} ${filename}`);

  services.request('download', 'genome-archive-path', { id, user, sessionID })
    .then(archivePath =>
      res.set({
        'Content-Disposition': `attachment;${filename ? ` filename="${filename}.zip"` : ''}`,
        'Content-type': 'application/zip',
      })
      .sendFile(archivePath)
    )
    .catch(next);
});

module.exports = router;
