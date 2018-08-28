const express = require('express');
const router = express.Router();

const { request } = require('services');

const downloads = require('utils/organismDownloads');
const downloadUtils = require('wgsa-front-end/universal/downloads');

const LOGGER = require('utils/logging').createLogger('Organism Downloads');

router.get('/:nickname/:type', (req, res, next) => {
  const { nickname, type } = req.params;
  const { contentType } = downloads[type];

  LOGGER.info(`Received request for ${nickname} file: ${type}`);

  const filename = downloadUtils.getFileName(nickname, type);
  res.set({
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Content-Type': contentType,
  });

  request('download', 'get-organism-file', { nickname, type }).
    then(stream => {
      stream.on('error', error => next(error));

      stream.pipe(res);
    }).
    catch(error => next(error));
});

module.exports = router;
