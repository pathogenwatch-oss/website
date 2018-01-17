const express = require('express');
const router = express.Router();

const LOGGER = require('utils/logging').createLogger('Downloads');

router.use('/:collectionId', (req, res, next) => {
  const { collectionId } = req.params;
  const genomeIds = req.method === 'GET' ? req.query.ids : req.body.ids;

  if (!collectionId || typeof collectionId !== 'string') {
    LOGGER.error('id not provided.');
    res.status(400).send('`id` parameter is required.');
    return;
  }

  if (genomeIds && typeof genomeIds !== 'string') {
    LOGGER.error('ids parameter is invalid.');
    res.status(400).send('`ids` parameter is invalid.');
    return;
  }

  next();
});

router.get('/:collectionId/fastas', require('./fastas'));
router.post('/:collectionId/fastas', require('./fastas'));

router.get('/:collectionId/annotations', require('./annotations'));
router.post('/:collectionId/annotations', require('./annotations'));

router.post('/:collectionId/:type-matrix', require('./matrix'));

router.post('/:collectionId/core-allele-distribution', require('./core-allele-distribution'));

router.get('/:collectionId/variance-summary', require('./variance-summary'));

router.post('/:collectionId/speciator', require('./speciator'));

module.exports = router;
