const express = require('express');
const router = express.Router();

const services = require('services');

const LOGGER = require('utils/logging').createLogger('Download');

router.get('/download', (req, res, next) => {
  const { ids } = req.query;
  const { user, sessionID } = req;

  if (!ids || typeof(ids) !== 'string' || ids === '') {
    LOGGER.error('Missing ids');
    return res.sendStatus(400);
  }

  return services.request('download', 'summary', { user, sessionID, ids: ids.split(',') })
    .then(result => res.json(result))
    .catch(next);
});

module.exports = router;
