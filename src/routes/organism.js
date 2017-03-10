const express = require('express');
const router = express.Router();

const services = require('../services');

const LOGGER = require('utils/logging').createLogger('Summary');

router.get('/organism/summary', (req, res, next) => {
  LOGGER.info('Received request to get summary');

  const { user, query } = req;
  services.request('organism', 'summary', { user, query }).
    then(response => res.json(response)).
    catch(next);
});

module.exports = router;
