const express = require('express');
const zlib = require('zlib');

const services = require('../services');

const router = express.Router();
const LOGGER = require('utils/logging').createLogger('Upload');

router.get('/genome/summary', (req, res, next) => {
  LOGGER.info('Received request to get genome summary');

  const { user, query, sessionID } = req;
  Promise.all([
    services.request('genome', 'summary', { user, query, sessionID }),
    services.request('genome', 'fetch-list', { user, query, sessionID }),
  ])
    .then(([ summary, genomes ]) => res.json({ summary, genomes }))
    .catch(next);
});

router.get('/genome/stats', (req, res, next) => {
  LOGGER.info('Received request to get genome stats data');

  const { user, query, sessionID } = req;
  services.request('genome', 'fetch-stats', { user, query, sessionID })
    .then(response => res.json(response))
    .catch(next);
});

router.get('/genome/map', (req, res, next) => {
  LOGGER.info('Received request to get genome marker data');

  const { user, query, sessionID } = req;
  services.request('genome', 'fetch-map', { user, query, sessionID })
    .then(response => res.json(response))
    .catch(next);
});

router.get('/genome/:id', (req, res, next) => {
  const { user, sessionID, params } = req;
  const { id } = params;

  LOGGER.info(`Received request to get single genome ${id}`);

  services.request('genome', 'fetch-one', { user, sessionID, id })
    .then(response => res.json(response))
    .catch(next);
});

router.get('/genome', (req, res, next) => {
  LOGGER.info('Received request to get genomes');

  const { user, query, sessionID } = req;
  services.request('genome', 'fetch-list', { user, query, sessionID }).
    then(response => res.json(response)).
    catch(next);
});

function getStream(req) {
  if (req.headers['content-type'] === 'application/zip') {
    return req.pipe(zlib.createInflate());
  }
  return req;
}

router.put('/genome', (req, res, next) => {
  LOGGER.info('Received request to create genome');

  const { user, sessionID } = req;
  const { name, uploadedAt, clientId } = req.query;

  services.request('genome', 'create', {
    timeout$: 1000 * 60 * 5,
    stream: getStream(req),
    metadata: { name, uploadedAt },
    user,
    sessionID,
    clientId,
  })
  .then(response => res.json(response))
  .catch(next);
});

router.post('/genome/:id/binned', (req, res, next) => {
  const { id } = req.params;
  const { user, body } = req;
  const { status } = body;

  LOGGER.info('Received request to bin genome:', status);

  services.request('genome', 'bin', { id, user, status })
    .then(response => res.json(response))
    .catch(next);
});

router.post('/genome/:id', (req, res, next) => {
  LOGGER.info('Received request to edit genome');

  const { id } = req.params;
  const { body, user, sessionID } = req;
  services.request('genome', 'edit', { id, user, sessionID, metadata: body })
    .then(response => res.json(response))
    .catch(next);
});

router.get('/upload/:uploadedAt', (req, res, next) => {
  LOGGER.info('Received request to get upload sessions');
  const { user, sessionID } = req;
  const { uploadedAt } = req.params;
  services.request('genome', 'fetch-upload', { user, sessionID, query: { uploadedAt } })
    .then(response => res.json(response))
    .catch(next);
});

router.get('/upload', (req, res, next) => {
  LOGGER.info('Received request to get upload sessions');
  const { user, sessionID } = req;
  services.request('genome', 'fetch-upload-list', { user, sessionID })
    .then(response => res.json(response))
    .catch(next);
});

module.exports = router;
