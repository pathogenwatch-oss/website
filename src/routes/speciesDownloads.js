const express = require('express');
const router = express.Router();

const downloads = require('models/speciesDownloads');
const fileModel = require('models/file');

const species = require('wgsa-front-end/universal/species');
const downloadUtils = require('wgsa-front-end/universal/downloads');

const LOGGER = require('utils/logging').createLogger('Species Downloads');

const speciesIds = species.reduce((memo, { nickname, id }) => {
  memo[nickname] = id;
  return memo;
}, {});

router.get('/:nickname/download/:fileName', function (req, res, next) {
  const { nickname, fileName } = req.params;
  const speciesId = speciesIds[nickname];
  const { contentType, fileOnDisk } = downloads[fileName];

  LOGGER.info(`Received request for ${nickname} file: ${fileName}`);

  const prettyFileName = downloadUtils.getPrettyFilename(nickname, fileName);

  res.set({
    'Content-Disposition': `attachment; filename="${prettyFileName}"`,
    'Content-Type': contentType,
  });

  const stream = fileModel.getSpeciesFile(speciesId, fileOnDisk(speciesId));

  stream.on('error', error => next(error));

  stream.pipe(res);
});

module.exports = router;
