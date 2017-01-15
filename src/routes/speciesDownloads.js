const express = require('express');
const router = express.Router();

const { request } = require('services');

const downloads = require('utils/speciesDownloads');
const downloadUtils = require('wgsa-front-end/universal/downloads');

const LOGGER = require('utils/logging').createLogger('Species Downloads');

router.get('/:nickname/download/:type', (req, res, next) => {
  const { nickname, type } = req.params;
  const { contentType } = downloads[type];

  LOGGER.info(`Received request for ${nickname} file: ${type}`);

  // TODO: Rename this function in FE Repo
  const prettyFileName = downloadUtils.getPrettyFilename(nickname, type);

  res.set({
    'Content-Disposition': `attachment; filename="${prettyFileName}"`,
    'Content-Type': contentType,
  });

  request('download', 'get-species-file', { nickname, type }).
    then(stream => {
      stream.on('error', error => next(error));

      stream.pipe(res);
    }).
    catch(error => next(error));
});

module.exports = router;
