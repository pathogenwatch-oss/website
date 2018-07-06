const express = require('express');
const router = express.Router();

const services = require('services');
const { NotFoundError } = require('../../utils/errors');

const LOGGER = require('utils/logging').createLogger('Summary');

router.get('/clustering/:genomeId', async (req, res, next) => {
  const { user } = req;
  const { threshold = null } = req.query;
  const { genomeId } = req.params;

  LOGGER.info('Received request for clusters', genomeId);

  try {
    const response = await services.request('clustering', 'fetch-view', { user, genomeId, threshold });
    const { size = 0 } = response;
    if (size <= 0) throw new NotFoundError(`No clusters found for ${genomeId} at threshold ${threshold}`);
    res.json(response);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
