var express = require('express');
var router = express.Router();

var collectionModel = require('models/collection');
var assemblyModel = require('models/assembly');

var LOGGER = require('utils/logging').createLogger('Collection requests');

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
  LOGGER.info('Received request for new collection id');

  collectionModel.add(req.params.id, req.body, function (error, result) {
    if (error) {
      return next(error);
    }
    res.json(result);
  });
});

router.post('/species/:speciesId/collection/:collectionId/assembly/:assemblyId',
  function (req, res) {
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
    assemblyModel.beginUpload(params, req.body);
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
