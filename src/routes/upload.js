const express = require('express');

const router = express.Router();

const services = require('../services');

const LOGGER = require('utils/logging').createLogger('Upload');

router.post('/collection', (req, res, next) => {
  LOGGER.info('Received request to create collection');

  return services.request('collection', 'create', req.body).
    then(({ collectionId }) => res.json({ collectionId })).
    catch(next);
});

module.exports = router;
