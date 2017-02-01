const express = require('express');

const router = express.Router();

const services = require('../services');

const LOGGER = require('utils/logging').createLogger('Upload');

router.put('/genome', (req, res, next) => {
  LOGGER.info('Received request to create genome');

  const { user } = req;
  const { name } = req.query;
  services.request('genome', 'create', { stream: req, metadata: { name }, user })
    .then(response => res.json(response))
    .catch(next);
});

router.get('/genome', (req, res, next) => {
  LOGGER.info('Received request to get genomes');

  const { user } = req;
  services.request('genome', 'fetch-list', { user }).
    then(response => res.json(response)).
    catch(next);
});

router.post('/genome/:id', (req, res, next) => {
  LOGGER.info('Received request to edit genome');

  const { id } = req.params;
  const { body, user } = req;
  services.request('genome', 'edit', { id, user, metadata: body })
    .then(response => res.json(response))
    .catch(next);
});

module.exports = router;
