const express = require('express');
const router = express.Router();

const services = require('services');

const LOGGER = require('utils/logging').createLogger('Download requests');

router.post('/organism/:organismId/download/type/:idType/format/:format',
  (req, res, next) => {
    const { format, organismId, idType } = req.params;
    const { uuids } = req.body;

    LOGGER.info(
      `Received request for download: ${format}`
    );

    if (!Array.isArray(uuids)) {
      res.sendStatus(400);
      return;
    }

    const options = {
      $timeout: 1000 * 60 * 2, format, organismId, uuids, idType,
    };

    services.request('backend', 'request-download', options).
      then(result => res.json(result)).
      catch(next);
  }
);

module.exports = router;
