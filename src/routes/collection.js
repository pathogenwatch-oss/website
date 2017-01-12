const express = require('express');
const router = express.Router();

const services = require('../services');
const path = require('path');

const LOGGER = require('utils/logging').createLogger('Collection requests');

const { demos = [] } = require('configuration');

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

if (demos.length) {
  for (const { speciesId, collectionId } of demos) {
    router.get(`/species/${speciesId}/collection/${collectionId}/status`,
      (req, res) => res.json({ status: 'READY' })
    );

    router.get(`/species/${speciesId}/collection/${collectionId}`,
      (req, res) =>
        res.sendFile(
          path.resolve(__dirname, '..', '..', 'demos', speciesId, `${collectionId}.json`)
        )
    );
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
