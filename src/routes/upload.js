const express = require('express');

const router = express.Router();

const services = require('../services');

const LOGGER = require('utils/logging').createLogger('Upload');

router.post('/upload', (req, res, next) => {
  LOGGER.info('Upload received');

  services.request('fasta', 'store', { stream: req, metadata: req.query }).
    then(response => res.json(response)).
    catch(next);
});

router.post('/collection', (req, res, next) => {
  LOGGER.info('Received request to create collection');

  return services.request('collection', 'create', req.body).
    then(({ uuid }) => res.json({ uuid })).
    catch(next);
});

module.exports = router;
