const express = require('express');
const router = express.Router();

const services = require('services');
const { NotFoundError } = require('../../utils/errors');

const LOGGER = require('utils/logging').createLogger('Summary');

router.post('/clustering', async (req, res, next) => {
  const { user, sessionID, body } = req;
  const { scheme, clientId } = body;

  LOGGER.info('Received request to run clustering for scheme', scheme);

  try {
    const response = await services.request('clustering', 'submit', { user, sessionID, scheme, clientId });
    res.json(response);
  } catch (e) {
    const { msg } = e;
    if (msg.indexOf('Already queued this job') !== -1) {
      res.status(304);
      res.json({ ok: 1 });
    } else {
      next(e);
    }
  }
});

router.get('/clustering/:genomeId', async (req, res, next) => {
  const { user, sessionID } = req;
  const { threshold = null } = req.query;
  const { genomeId } = req.params;

  LOGGER.info('Received request for clusters', genomeId);

  try {
    const response = await services.request('clustering', 'fetch-view', { user, sessionID, genomeId, threshold });
    const { size = 0 } = response;
    if (size <= 0) throw new NotFoundError(`No clusters found for ${genomeId} at threshold ${threshold}`);
    res.json(response);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
