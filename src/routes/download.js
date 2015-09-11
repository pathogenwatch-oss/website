var express = require('express');
var router = express.Router();

var fileModel = require('models/file');

var LOGGER = require('utils/logging').createLogger('Download requests');

router.post(
  '/download/type/:idType/format/:fileFormat', function (req, res, next) {
    var downloadRequest = {
      idType: req.params.idType,
      format: req.params.fileFormat,
      idToUserNameMap: req.body.idToFilenameMap,
      idList: Object.keys(req.body.idToFilenameMap),
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
  LOGGER.info('Received request for files: ' + req.params.fileName);
  fileModel.getFile(req.params.fileName, function (error, result, next) {
    if (error) {
      return next(error);
    }

    if (!req.query.prettyFileName) {
      return res.status(400).send('`prettyFileName` query parameter is required.');
    }

    res.set({
      'Content-Disposition': 'attachment; filename="' + req.query.prettyFileName + '"',
      'Content-type': 'text/plain'
    });
    res.send(result);
  });
});

module.exports = router;
