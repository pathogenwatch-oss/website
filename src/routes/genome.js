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

router.get('/genome/stats', (req, res) => {
  LOGGER.info('Received request to get genome stats data');
  LOGGER.info('Requested metric:', req.query.metric);

  res.sendStatus(501);
});

router.get('/genome/map', (req, res) => {
  LOGGER.info('Received request to get genome marker data');

  res.sendStatus(501);
});

router.get('/genome/:id', (req, res) => {
  LOGGER.info('Received request to get single genome');

  res.sendStatus(501);
});

router.get('/genome', (req, res, next) => {
  LOGGER.info('Received request to get genomes');

  const { user, query } = req;
  services.request('genome', 'fetch-list', { user, query }).
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
