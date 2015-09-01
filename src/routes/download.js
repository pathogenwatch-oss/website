var express = require('express');
var router = express.Router();
var path = require('path');

var fileModel = require('models/file');

var LOGGER = require('utils/logging').createLogger('Download requests');
var config = require('configuration').server;

router.post(
  '/download/type/:idType/format/:fileFormat', function (req, res, next) {
    var downloadRequest = {
      idType: req.params.idType,
      format: req.params.fileFormat,
      idToUserNameMap: req.body.idToFilenameMap,
      speciesId: req.body.speciesId
    };

    LOGGER.info(
      'Received request for download: ' + downloadRequest.idType + ', ' +
        downloadRequest.format
    );
    LOGGER.debug(downloadRequest);

    fileModel.requestDownload(downloadRequest, function (error, result) {
      if (error) {
        return next(error);
      }
      res.json(result);
    });
  }
);

router.get('/download/file/:fileName', function (req, res) {
  var fileName = req.params.fileName;
  LOGGER.info('Received request for file: ' + fileName);

  if (fileName.match(/(\\|\/)/gm)) {
    return res.sendStatus(400);
  }

  res.set({
    'Content-Disposition': 'attachment; filename="' + fileName + '"',
    'Content-type': 'text/plain'
  });
  res.sendFile(path.join(config.fileDirectory, fileName));
});

module.exports = router;
