var async = require('async');

var assemblyModel = require('models/assembly');
var antibioticModel = require('models/antibiotic');

var LOGGER = require('utils/logging').createLogger('Assembly ctrl');

function addAssembly(req, res) {
  var ids = {
    collectionId: req.body.collectionId,
    socketRoomId: req.body.socketRoomId,
    fileAssemblyId: req.body.fileAssemblyId,
    assemblyId: req.body.assemblyId
  };

  LOGGER.info(
    'Adding assembly ' + ids.assemblyId + ' to collection ' + ids.collectionId
  );

  // Validate request
  if (!ids.collectionId) {
    LOGGER.error('Missing collection id');
  }
  if (!ids.socketRoomId) {
    LOGGER.error('Missing socket room id');
  }
  if (!ids.fileAssemblyId) {
    LOGGER.error('Missing file assembly id');
  }
  if (!ids.assemblyId) {
    LOGGER.error('Missing assembly id');
  }

  res.json({
    assemblyId: ids.assemblyId
  });

  assemblyModel.beginUpload(ids, req.body.metadata, req.body.sequences);
}

function getCompleteAssembly(req, res) {
  async.parallel({
    assembly: assemblyModel.getComplete.bind(null, req.params.id),
    antibiotics: antibioticModel.getAll
  },
  function (error, result) {
    if (error) {
      LOGGER.error(error, result);
      return res.sendStatus(500);
    }
    res.json(result);
  });
}

function getMultipleAssemblies(req, res) {
  var assemblyIds = req.query.ids && req.query.ids.split(',');
  if (!assemblyIds || !assemblyIds.length) {
    return res.sendStatus(400);
  }
  assemblyModel.getMany(assemblyIds, function (error, assemblies) {
    if (error) {
      LOGGER.error(error);
      return res.sendStatus(500);
    }
    res.json(assemblies);
  });
}

function getResistanceProfile(req, res) {
  var assemblyIds = req.query.ids && req.query.ids.split(',');
  if (!assemblyIds || !assemblyIds.length) {
    return res.sendStatus(400);
  }
  assemblyModel.getResistanceProfile(assemblyIds,
    function (error, resistanceProfile) {
      if (error) {
        LOGGER.error(error, resistanceProfile);
        return res.sendStatus(500);
      }
      res.json({
        resistanceProfile: resistanceProfile
      });
    }
  );
}

function getAssemblyTableData(req, res) {
  var assemblyIds = req.query.ids && req.query.ids.split(',');
  if (!assemblyIds || !assemblyIds.length) {
    return res.sendStatus(400);
  }
  assemblyModel.getTableData(assemblyIds, function (error, tableData) {
    if (error) {
      return res.status(500).json({ error: error });
    }
    res.json(tableData);
  });
}

function getCoreResult(req, res, next) {
  assemblyModel.getCoreResult(req.params.id, function (error, result) {
    if (error) {
      return next(error, null);
    }
    res.send(result);
  });
}

module.exports.addAssembly = addAssembly;
module.exports.getMultipleAssemblies = getMultipleAssemblies;
module.exports.getCompleteAssembly = getCompleteAssembly;
module.exports.getResistanceProfile = getResistanceProfile;
module.exports.getAssemblyTableData = getAssemblyTableData;
module.exports.getCoreResult = getCoreResult;
