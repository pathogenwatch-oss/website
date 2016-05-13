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
    LOGGER.info('Received request for file: ' + req.params.fileName);

    if (!req.query.prettyFileName) {
      return res.status(400).send('`prettyFileName` query parameter is required.');
    }

    res.set({
      'Content-Disposition': `attachment; filename="${req.query.prettyFileName}.zip"`,
      'Content-type': 'application/zip',
    });

    const stream = fileModel.getFile(req.params);

    stream.on('error', error => next(error));

    stream.pipe(res);
  }
);

const speciesDownloads = {
  'core_representatives.csv': {
    contentType: 'text/csv',
    fileOnDisk: () => 'core_rep_map.tsv',
  },
  'reference_fastas.zip': {
    contentType: 'application/zip',
    fileOnDisk: () => 'fastas.zip',
  },
  'reference_annotations.zip': {
    contentType: 'application/zip',
    fileOnDisk: (speciesId) => `wgsa_gff_${speciesId}`,
  },
  'reference_metadata.csv': {
    contentType: 'text/csv',
    fileOnDisk: () => 'metadata.csv',
  },
};

function getPrettyFilename({ speciesId, fileName }) {
  return `wgsa_${getSpeciesNickname(speciesId)}_${fileName}`;
}

router.get('/species/:speciesId/download/:fileName', function (req, res, next) {
  const { speciesId, fileName } = req.params;
  const { contentType, fileOnDisk } = speciesDownloads[fileName];

  LOGGER.info(`Received request for ${speciesId} file: ${fileName}`);

  res.set({
    'Content-Disposition': `attachment; filename="${getPrettyFilename(req.params)}"`,
    'Content-type': contentType,
  });

  const stream = fileModel.getSpeciesFile(speciesId, fileOnDisk(speciesId));

  stream.on('error', error => next(error));

  stream.pipe(res);
});

module.exports = router;
