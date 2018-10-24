const express = require('express');
const router = express.Router();

const services = require('services');

const LOGGER = require('utils/logging').createLogger('Download');

router.post('/download', (req, res, next) => {
  const { ids } = req.body;
  const { user } = req;

  if (!ids || !Array.isArray(ids)) {
    LOGGER.error('Missing ids');
    return res.sendStatus(400);
  }

  return services.request('download', 'summary', { user, ids })
    .then(result => res.json(result))
    .catch(next);
});

module.exports = router;
