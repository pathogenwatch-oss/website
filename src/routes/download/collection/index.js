const express = require('express');
const router = express.Router();

const { request } = require('services');

const LOGGER = require('utils/logging').createLogger('Downloads');

router.use('/:token', async (req, res, next) => {
  const { token } = req.params;
  const genomeIds = req.method === 'GET' ? req.query.ids : req.body.ids;

  if (!token || typeof token !== 'string') {
    LOGGER.error('id not provided.');
    res.status(400).send('`id` parameter is required.');
    return;
  }

  if (genomeIds && typeof genomeIds !== 'string') {
    LOGGER.error('ids parameter is invalid.');
    res.status(400).send('`ids` parameter is invalid.');
    return;
  }

  try {
    const { user } = req;
    await request('collection', 'authorise-genomes', { user, token, genomeIds: genomeIds ? genomeIds.split(',') : [] });
    next();
  } catch (e) {
    next(e);
  }
});

router.get('/:token/fastas', require('./fastas'));
router.post('/:token/fastas', require('./fastas'));

router.get('/:token/annotations', require('./annotations'));
router.post('/:token/annotations', require('./annotations'));

router.post('/:token/:type-matrix', require('./matrix'));

router.post('/:token/core-allele-distribution', require('./core-allele-distribution'));

router.get('/:token/variance-summary', require('./variance-summary'));

router.post('/:token/speciator', require('./speciator'));

module.exports = router;
