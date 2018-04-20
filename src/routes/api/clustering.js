const express = require('express');
const router = express.Router();

const services = require('services');

const LOGGER = require('utils/logging').createLogger('Summary');

router.post('/clustering/:scheme', async (req, res, next) => {
  const { user, sessionID, body } = req;
  const { scheme, clientId } = body;

  LOGGER.info('Received request to run clustering for scheme', scheme);

  try {
    const response = await services.request('clustering', 'submit', { user, sessionID, scheme, clientId });
    res.json(response);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
