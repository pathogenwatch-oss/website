const express = require('express');
const router = express.Router();

const services = require('services');

const LOGGER = require('utils/logging').createLogger('Download requests');

router.post('/species/:speciesId/download/type/:idType/format/:fileFormat',
  (req, res, next) => {
    const downloadRequest = {
      idType: req.params.idType === 'genome' ? 'assembly' : req.params.idType,
      format: req.params.fileFormat,
      idList: req.body.idList,
      speciesId: req.params.speciesId,
    };

    LOGGER.info(
      `Received request for download: ${downloadRequest.idType}, ${downloadRequest.format}`
    );

    services.request('backend', 'request-download', { request: downloadRequest }).
      then(result => res.json(result)).
      catch(error => next(error));
  }
);

module.exports = router;
