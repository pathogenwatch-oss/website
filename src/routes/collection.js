const express = require('express');
const router = express.Router();

const fastaStorage = require('wgsa-fasta-store');

const collectionModel = require('models/collection');
const assemblyModel = require('models/assembly');

const LOGGER = require('utils/logging').createLogger('Collection requests');
const { maxCollectionSize = 0, fastaStoragePath } = require('configuration');

router.get('/collection/:collectionId', (req, res, next) => {
  LOGGER.info(`Getting collection: ${req.params.collectionId}`);
  return collectionModel.getAggregated(req.params.collectionId)
    .then(result => res.json(result))
    .catch(error => next(error));
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

router.get('/species/:speciesId/collection/:collectionId/status', function (req, res, next) {
  LOGGER.info(`Received request for collection ${req.params.collectionId} upload progress`);
  collectionModel.getStatus(req.params, function (error, result) {
    if (error) {
      return next(error);
    }
    res.json(result);
  });
});

router.get('/species/:speciesId/collection/:collectionId', function (req, res, next) {
  LOGGER.info('Getting collection: ' + req.params.collectionId);
  collectionModel.get(req.params, function (error, result) {
    if (error) {
      return next(error);
    }
    res.json(result);
  });
});

router.post('/species/:id/collection', function (req, res, next) {
  var assemblyNames = req.body.assemblyNames; // waiting for destructuring

  LOGGER.info('Received request for new collection id');

  if (!assemblyNames || !assemblyNames.length ||
    (maxCollectionSize && assemblyNames.length > maxCollectionSize)) {
    return res.sendStatus(400);
  }

  collectionModel.add(req.params.id, req.body, function (error, result) {
    if (error) {
      return next(error);
    }
    res.json(result);
  });
});

router.post('/species/:speciesId/collection/:collectionId/assembly/:assemblyId',
  function (req, res, next) {
    const { params } = req;

    LOGGER.info(
      `Adding assembly ${params.assemblyId} to collection ${params.collectionId}`
    );

    // TODO: Send error responses
    if (!params.collectionId) {
      LOGGER.error('Missing collection id');
    }
    if (!params.assemblyId) {
      LOGGER.error('Missing assembly id');
    }
    if (!params.speciesId) {
      LOGGER.error('Missing species id');
    }

    res.json({ assemblyId: params.assemblyId });

    const { storageId, metadata, metrics } = req.body;

    fastaStorage.retrieve(fastaStoragePath, storageId).
      then(sequences =>
        assemblyModel.beginUpload(params, { sequences, metadata, metrics })
      ).
      catch(error => next(error));
  }
);

router.get('/species/:speciesId/collection/:collectionId/subtree/:subtreeId',
  function (req, res, next) {
    LOGGER.info(`Received request for subtree ${req.params.subtreeId}`);

    collectionModel.getSubtree(req.params, function (error, result) {
      if (error) {
        return next(error);
      }
      res.json(result);
    });
  }
);

module.exports = router;
