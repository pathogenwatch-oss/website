const express = require('express');

const router = express.Router();

const services = require('../services');

const LOGGER = require('utils/logging').createLogger('Upload');

router.post('/assembly/upload', (req, res, next) => {
  LOGGER.info('Received request to upload assembly');

  services.request('fasta', 'store', { stream: req, metadata: req.query })
    .then(response => res.json(response))
    .catch(next);
});

router.post('/assembly/edit', (req, res, next) => {
  LOGGER.info('Received request to edit assembly');

  services.request('fasta', 'edit', req.body)
    .then(response => res.json(response))
    .catch(next);
});

module.exports = router;
