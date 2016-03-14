var express = require('express');
var router = express.Router();

var fileModel = require('models/file');

var LOGGER = require('utils/logging').createLogger('Download requests');

router.post('/species/:speciesId/download/type/:idType/format/:fileFormat',
  function (req, res, next) {
    var downloadRequest = {
      idType: req.params.idType,
      format: req.params.fileFormat,
      idList: req.body.idList,
      speciesId: req.params.speciesId
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

router.get('/species/:speciesId/download/file/:fileName',
  function (req, res, next) {
    LOGGER.info('Received request for files: ' + req.params.fileName);

    if (!req.query.prettyFileName) {
      return res.status(400).send('`prettyFileName` query parameter is required.');
    }

    res.set({
      'Content-Disposition': `attachment; filename="${req.query.prettyFileName}.zip"`,
      'Content-type': 'application/zip'
    });

    const stream = fileModel.getFile(req.params);

    stream.on('error', error => next(error));

    stream.pipe(res);
  }
);

router.get('/species/:speciesId/download/:fileName', function (req, res, next) {
  LOGGER.info('Received request for files: ' + req.params.fileName);

  if (!req.query.prettyFileName) {
    return res.status(400).send('`prettyFileName` query parameter is required.');
  }

  res.set({
    'Content-Disposition': `attachment; filename="${req.query.prettyFileName}"`,
    'Content-type': 'text/plain'
  });

  const stream = fileModel.getSpeciesFile(req.params);

  stream.on('error', error => next(error));

  stream.pipe(res);
});

module.exports = router;
