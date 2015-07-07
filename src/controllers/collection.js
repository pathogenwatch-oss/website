var collectionModel = require('models/collection');
var appConfig = require('configuration');

var LOGGER = require('utils/logging').createLogger('Collection ctrl');

function addCollection(req, res, next) {
  var collectionId = req.body.collectionId;

  var message =
    (collectionId && collectionId.length > 0 ?
    'Received request for collection id: ' + collectionId :
    'Received request for new collection id');
  LOGGER.info(message);

  collectionModel.add(
    req.body.collectionId,
    req.body.userAssemblyIds,
    function (error, result) {
      if (error) {
        return next(error);
      }
      res.json(result);
    }
  );
}

function getCollection(req, res, next) {
  var collectionId = req.body.collectionId;
  collectionModel.get(collectionId, function (error, result) {
    if (error) {
      return next(error);
    }
    res.json(result);
  });
}

function getRepresentativeCollection(req, res, next) {
  LOGGER.info('Getting representative collection');
  collectionModel.getRepresentativeCollection(function (error, result) {
    if (error) {
      return next(error);
    }
    res.json(result);
  });
}

function renderExistingCollection(req, res) {
  var collectionId = req.params.id;

  LOGGER.info('Requested ' + collectionId + ' collection');

  res.render('app', {
    appConfig: JSON.stringify(appConfig.client),
    requestedCollectionId: collectionId
  });
}

function renderNewCollection(req, res) {
  res.render('app', {
    appConfig: JSON.stringify(appConfig.client),
    newCollection: true
  });
}

function mergeCollectionTrees(req, res) {
  res.json({});
  collectionModel.mergeCollectionTrees(req.body);
}

function getMergeTree(req, res) {
  res.json({});
  collectionModel.getMergeTree(req.body);
}

module.exports.addCollection = addCollection;
module.exports.getCollection = getCollection;
module.exports.getRepresentativeCollection = getRepresentativeCollection;
module.exports.renderExistingCollection = renderExistingCollection;
module.exports.renderNewCollection = renderNewCollection;
module.exports.mergeCollectionTrees = mergeCollectionTrees;
module.exports.getMergeTree = getMergeTree;
