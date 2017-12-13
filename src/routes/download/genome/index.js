const express = require('express');
const router = express.Router();

const services = require('services');

const LOGGER = require('utils/logging').createLogger('Downloads');

router.get('/:id/fasta', (req, res, next) => {
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

router.post('/fasta', (req, res, next) => {
  const { user, sessionID } = req;
  const { filename = 'wgsa-genomes.zip' } = req.query;
  const { ids } = req.body;

  if (!ids || !ids.length) return res.sendStatus(400);
  const splitIds = ids.split(',');

  LOGGER.info(`Received request for archive of ${splitIds.length} files`);

  return (
    services.request('download', 'fetch-genomes',
        { user, sessionID, ids: splitIds, projection: { name: 1, fileId: 1 } })
      .then(genomes =>
        services.request('download', 'create-genome-archive', { genomes }))
      .then(stream => {
        stream.on('error', next);
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', 'application/zip');
        stream.pipe(res);
      })
      .catch(next)
  );
});

module.exports = router;
