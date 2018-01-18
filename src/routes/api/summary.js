const express = require('express');
const router = express.Router();

const services = require('services');

const LOGGER = require('utils/logging').createLogger('Summary');

router.get('/summary', (req, res, next) => {
  LOGGER.info('Received request to get summary');

  const { user, sessionID } = req;
  services.request('summary', 'fetch', { user, sessionID }).
    then(response => res.json(response)).
    catch(next);
});

module.exports = router;
