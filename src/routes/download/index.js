const express = require('express');
const router = express.Router();

const services = require('services');

const LOGGER = require('utils/logging').createLogger('Downloads');

router.get('/file/:filename',
  (req, res, next) => {
    const { filename } = req.params;
    LOGGER.info(`Received request for file: ${filename}`);

    if (!req.query.filename) {
      res.status(400).send('`filename` query parameter is required.');
      return;
    }

    res.set({
      'Content-Disposition': `attachment; filename="${req.query.filename}.zip"`,
      'Content-type': 'application/zip',
    });

    services.request('download', 'get-file', { filename }).
      then(stream => {
        stream.on('error', error => next(error));

        stream.pipe(res);
      }).
      catch(next);
  }
);

router.use('/analysis', require('./analysis'));

router.use('/genome', require('./genome'));

router.use('/collection', require('./collection'));

router.use('/organism', require('./organism'));

router.use(require('../notFound'));

module.exports = router;
