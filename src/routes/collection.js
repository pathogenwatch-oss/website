var express = require('express');
var router = express.Router();

var collectionModel = require('models/collection');
var assemblyModel = require('models/assembly');

var LOGGER = require('utils/logging').createLogger('Collection requests');

router.get('/collection/reference/:id', function (req, res, next) {
  LOGGER.info('Getting reference collection: ' + req.params.id);
  collectionModel.getReference(req.params.id,
    function (error, result) {
      if (error) {
        return next(error);
      }
      res.json(result);
    }
  );
});

router.get('/collection/:id', function (req, res, next) {
  LOGGER.info('Getting collection: ' + req.params.id);
  collectionModel.get(req.params.id, function (error, result) {
    if (error) {
      return next(error);
    }
    res.json(result);
  });
});

router.post('/collection', function (req, res, next) {
  var collectionId = req.body.collectionId;
  var message =
    (collectionId && collectionId.length > 0 ?
    'Received request for collection id: ' + collectionId :
    'Received request for new collection id');

  LOGGER.info(message);

  collectionModel.add(req.body, function (error, result) {
    if (error) {
      return next(error);
    }
    res.json(result);
  });
});

router.post('/collection/:collectionId/assembly/:assemblyId',
  function (req, res) {
    var ids = {
      collectionId: req.params.collectionId,
      assemblyId: req.params.assemblyId,
      socketRoomId: req.body.socketRoomId,
      speciesId: req.body.speciesId
    };

    LOGGER.info(
      'Adding assembly ' + ids.assemblyId + ' to collection ' + ids.collectionId
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

    assemblyModel.beginUpload(ids, req.body.metadata, req.body.sequences);
  }
);

module.exports = router;
