const express = require('express');
const router = express.Router();

const services = require('services');

const LOGGER = require('utils/logging').createLogger('Download requests');

router.post('/organism/:organismId/download/type/:idType/format/:format',
  (req, res, next) => {
    const { format, organismId } = req.params;
    const { idList } = req.body;

    LOGGER.info(
      `Received request for download: ${format}`
    );

    services.request('backend', 'request-download', { format, organismId, idList }).
      then(result => res.json(result)).
      catch(next);
  }
);

module.exports = router;
