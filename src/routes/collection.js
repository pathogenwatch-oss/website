const express = require('express');
const router = express.Router();
const services = require('../services');

const collectionModel = require('models/collection');

const LOGGER = require('utils/logging').createLogger('Collection requests');

router.put('/collection', (req, res, next) => {
  LOGGER.info('Received request to create collection');

  const { user } = req;
  const { genomeIds, title, description, speciesId } = req.body;
  const message = { user, genomeIds, title, description, speciesId };

  return services.
    request('collection', 'create', message).
    then(({ collectionId }) => res.json({ collectionId })).
    catch(next);
});

router.get('/collection/:uuid', (req, res, next) => {
  LOGGER.info(`Getting collection: ${req.params.uuid}`);
  return services.request('collection', 'fetch', req.params).
    then(response => res.json(response)).
    catch(next);
});

router.get('/collection/:uuid/subtree/:name', (req, res, next) => {
  LOGGER.info('Received request for subtree', req.params);
  return services.request('collection', 'subtree', req.params).
    then(response => res.json(response)).
    catch(next);
});

router.get('/collection', (req, res, next) => {
  LOGGER.info('Received request to get collections');

  const { user } = req;
  services.request('collection', 'fetch-list', { user })
    .then(response => res.json(response))
    .catch(next);
});

router.get('/species/:id/reference', function (req, res, next) {
  LOGGER.info('Getting reference collection: ' + req.params.id);
  collectionModel.getReference(req.params.id, function (error, result) {
    if (error) {
      return next(error);
    }
    res.json(result);
  });
});


module.exports = router;
