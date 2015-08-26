var express = require('express');
var router = express.Router();

var fileModel = require('models/file');

var LOGGER = require('utils/logging').createLogger('Download requests');

router.get(
  '/download/type/:idType/format/:fileFormat', function (req, res, next) {
    var downloadRequest = {
      idType: req.params.idType,
      format: req.params.fileFormat,
      idToUserNameMap: req.body
    };
    LOGGER.info('Received request for download: ' + downloadRequest.idType + ', ' + downloadRequest.fileFormat);
    fileModel.requestDownload(downloadRequest, function (error, result){
      if (error){
        return next(error);
      }
      res.json(result);
    });
});

router.get(
  '/download/file/:fileName', function (req, res, next) {
    LOGGER.info('Received request for file: ' + req.params.fileName);
    fileModel.getFile(req.params.fileName, function (error, result) {
      if (error) {
        return next(error);
      }
      res.set({
        'Content-Disposition': 'attachment; filename="' + req.params.fileName + '"',
        'Content-type': 'text/plain'
      });
      res.send(result);
    })
  }
);

module.exports = router;
