const express = require('express');
const router = express.Router();

const services = require('../services');
const path = require('path');

const LOGGER = require('utils/logging').createLogger('Collection requests');
const config = require('configuration');

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

if (config.node.auth) {
  const auth = require('http-auth');
  const { realm, file, collections } = config.node.auth;
  const basic = auth.basic({ realm, file });
  const middleware = auth.connect(basic);
  for (const { speciesId, collectionId } of collections) {
    router.get(`/collection/${collectionId}`, middleware, (req, res, next) => {
      LOGGER.info(`Requesting authorized collection: ${speciesId}/${collectionId}`);
      req.params.uuid = collectionId;
      next();
    });
  }
}

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
  services.request('collection', 'fetch-list', { user }).
    then(response => res.json(response)).
    catch(next);
});

module.exports = router;
