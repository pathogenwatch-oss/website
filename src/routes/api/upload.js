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
  const { user } = req;
  services
    .request('tasks', 'queue-position', { userId: user._id })
    .then((result) => res.json(result))
    .catch(next);
});

router.get('/upload/:uploadedAt', (req, res, next) => {
  LOGGER.info('Received request to get upload session');
  const { user } = req;
  const { uploadedAt } = req.params;
  Promise.all([
    services.request('genome', 'fetch-upload', { user, query: { uploadedAt } }),
    services.request('tasks', 'queue-position', { userId: user._id }),
  ])
    .then(([ { genomes, progress }, { position } ]) => res.json({ genomes, position, progress }))
    .catch(next);
});

router.get('/upload/:uploadedAt/progress', (req, res, next) => {
  // returns { runningSince = [], failed = 0, complete = 0 }
  LOGGER.info('Received request to get assembly progress');
  const { user } = req;
  const { uploadedAt } = req.params;
  services.request('genome', 'fetch-assembly-progress', { userId: user._id, uploadedAt })
    .then((response) => res.json(response))
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
