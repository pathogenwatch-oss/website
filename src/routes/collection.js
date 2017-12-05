const express = require('express');
const router = express.Router();

const services = require('../services');

const LOGGER = require('utils/logging').createLogger('Collection requests');
const config = require('configuration');

router.put('/collection', (req, res, next) => {
  LOGGER.info('Received request to create collection');
  const { user, sessionID } = req;
  const { genomeIds, title, description, pmid, organismId } = req.body;
  const message = { user, sessionID, genomeIds, title, description, pmid, organismId };

  return services.
    request('collection', 'create', message).
    then(result => res.status(201).json(result)).
    catch(next);
});

if (config.node.auth) {
  const auth = require('http-auth');
  const { realm, file, collections } = config.node.auth;
  const basic = auth.basic({ realm, file });
  const middleware = auth.connect(basic);
  for (const { organismId, collectionId } of collections) {
    router.get(`/collection/${collectionId}`, middleware, (req, res, next) => {
      LOGGER.info(`Requesting authorized collection: ${organismId}/${collectionId}`);
      req.params.uuid = collectionId;
      next();
    });
  }
}

router.get('/collection/summary', (req, res, next) => {
  LOGGER.info('Received request to get collection summary');

  const { user, query } = req;
  Promise.all([
    services.request('collection', 'summary', { user, query }),
    services.request('collection', 'fetch-list', { user, query }),
  ])
  .then(([ summary, collections ]) => res.json({ summary, collections }))
  .catch(next);
});

router.post('/collection/:id/binned', (req, res, next) => {
  const { id } = req.params;
  const { user, body } = req;
  const { status } = body;

  LOGGER.info('Received request to bin collection:', status);

  services.request('collection', 'bin', { id, user, status })
    .then(response => res.json(response))
    .catch(next);
});

router.get('/collection/:uuid/tree/:name', (req, res, next) => {
  LOGGER.info('Received request for tree', req.params);
  const { user } = req;
  const { uuid, name } = req.params;
  const treeType = (name === 'collection') ? 'tree' : 'subtree';
  return services.request('collection', treeType, { user, uuid, name })
    .then(response => res.json(response))
    .catch(next);
});

router.get('/collection/:uuid', (req, res, next) => {
  LOGGER.info(`Getting collection: ${req.params.uuid}`);
  const { user, params } = req;
  return services.request('collection', 'fetch-one', { user, uuid: params.uuid })
    .then(response => res.json(response))
    .catch(error => (
      error.details.message === 'Collection not found' ? // Seneca loses error type :|
        res.sendStatus(404) :
        next(error)
      )
    );
});

router.get('/collection', (req, res, next) => {
  LOGGER.info('Received request to get collections');

  const { user, query } = req;
  services.request('collection', 'fetch-list', { user, query })
    .then(response => res.json(response))
    .catch(next);
});

router.get('/showcase', (req, res, next) => {
  LOGGER.info('Received request to get showcase');

  services.request('collection', 'showcase')
    .then(response => res.json(response))
    .catch(next);
});

module.exports = router;
