const express = require('express');
const router = express.Router();

const services = require('services');

const LOGGER = require('utils/logging').createLogger('Collection requests');

router.put('/collection', (req, res, next) => {
  LOGGER.info('Received request to create collection');
  const { user } = req;
  const { genomeIds, title, description, pmid, organismId } = req.body;
  const message = { user, genomeIds, title, description, pmid, organismId };

  return services
    .request('collection', 'create', message)
    .then(result => res.status(201).json(result))
    .catch(next);
});

router.post('/collection/verify', async (req, res, next) => {
  LOGGER.info('Received request to verify collection input');
  const { user } = req;
  const { genomeIds, organismId } = req.body;
  const message = { user, genomeIds, organismId };

  try {
    const result = await services.request('collection', 'verify', message);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

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

router.get('/collection/position/:uploadedAt', (req, res, next) => {
  LOGGER.info('Received request to get tree position');
  const { uploadedAt } = req.params;
  services.request('tasks', 'queue-position', { uploadedAt, type: 'collection' })
    .then(result => res.json(result))
    .catch(next);
});

router.post('/collection/:token/binned', (req, res, next) => {
  const { token } = req.params;
  const { user, body } = req;
  const { status } = body;

  LOGGER.info('Received request to bin collection:', status);

  services.request('collection', 'bin', { token, user, status })
    .then(response => res.json(response))
    .catch(next);
});

router.post('/collection/:token/access', (req, res, next) => {
  const { token } = req.params;
  const { user, body } = req;
  const { access } = body;

  LOGGER.info('Received request to change collection access:', token);

  services.request('collection', 'access-level', { user, token, access })
    .then(response => res.json(response))
    .catch(next);
});

router.get('/collection/:token/tree/:name', (req, res, next) => {
  LOGGER.info('Received request for tree', req.params);
  const { user } = req;
  const { token, name } = req.params;
  const treeType = (name === 'collection') ? 'tree' : 'subtree';
  return services.request('collection', `fetch-${treeType}`, { user, token, name })
    .then(response => res.json(response))
    .catch(next);
});

router.get('/collection/:token', (req, res, next) => {
  const { user, params } = req;
  const { token } = params;
  LOGGER.info(`Getting collection: ${token}`);
  return services.request('collection', 'fetch-one', { user, token })
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
