const express = require('express');

const services = require('services');

const router = express.Router();
const LOGGER = require('utils/logging').createLogger('Upload');

router.use('/upload', (req, res, next) => {
  const { user } = req;

  if (!user || !user._id) {
    res.sendStatus(401);
    return;
  }

  next();
});

router.get('/upload/:uploadedAt/position', (req, res, next) => {
  LOGGER.info('Received request to get upload position');
  const { uploadedAt } = req.params;
  services
    .request('tasks', 'queue-position', { uploadedAt })
    .then((result) => res.json(result))
    .catch(next);
});

function formatUploadProgress(genomes) {
  return genomes.map(({ id: genomeId, files, uploadComplete }) => ({
    genomeId,
    files: files.map((fileName) => ({ fileId: fileName, complete: uploadComplete })),
  }));
}

router.get('/upload/:uploadedAt', (req, res, next) => {
  LOGGER.info('Received request to get upload session');
  const { user } = req;
  const { uploadedAt } = req.params;
  Promise.all([
    services.request('genome', 'fetch-upload', { user, query: { uploadedAt } }),
    services.request('tasks', 'queue-position', { uploadedAt }),
  ])
    .then(([ genomes, { position } ]) => res.json({ genomes, position, progress: formatUploadProgress(genomes) }))
    .catch(next);
});

router.get('/upload', (req, res, next) => {
  LOGGER.info('Received request to get upload sessions');
  const { user } = req;
  services
    .request('genome', 'fetch-upload-list', { user })
    .then((response) => res.json(response))
    .catch(next);
});

module.exports = router;
