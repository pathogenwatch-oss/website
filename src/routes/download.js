var express = require('express');
var router = express.Router();

var fileModel = require('models/file');

var LOGGER = require('utils/logging').createLogger('Download requests');

router.get(
  '/download/assembly/:id/metadata/:format',
  downloadController.downloadAssemblyMetadata
);

router.get(
  '/download/type/:idType/format/:fileFormat', function (req, res, next) {
    LOGGER.info('Received request for download: ' + req.params.idType + ', ' + req.params.fileFormat);
    fileModel.requestDownload(req, function (error,result){
      if (error){
        return next(error);
      }
      res.json(result);
    });
});

module.exports = router;
