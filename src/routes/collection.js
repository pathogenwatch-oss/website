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
    var ids = {
      collectionId: req.params.collectionId,
      assemblyId: req.params.assemblyId,
      speciesId: req.params.speciesId,
      socketRoomId: req.body.socketRoomId,
    };

    LOGGER.info(
      `Adding assembly ${ids.assemblyId} to collection ${ids.collectionId}`
    );

    // TODO: Send error responses
    if (!ids.collectionId) {
      LOGGER.error('Missing collection id');
    }
    if (!ids.socketRoomId) {
      LOGGER.error('Missing socket room id');
    }
    if (!ids.assemblyId) {
      LOGGER.error('Missing assembly id');
    }
    if (!ids.speciesId) {
      LOGGER.error('Missing species id');
    }

    res.json({
      assemblyId: ids.assemblyId
    });

    assemblyModel.beginUpload(ids, req.body);
  }
);

router.get('/species/:speciesId/collection/:collectionId/subtree/:subtreeId',
  function (req, res, next) {
    const { id, collectionId } = req.params;
    LOGGER.info(`Received request for subtree ${id} in collection ${collectionId}`);

    collectionModel.getSubtree(req.params, function (error, result) {
      if (error) {
        return next(error);
      }
      res.json(result);
    });
  }
);

module.exports = router;
