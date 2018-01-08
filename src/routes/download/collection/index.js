const express = require('express');
const router = express.Router();

const LOGGER = require('utils/logging').createLogger('Downloads');

router.use('/:uuid', (req, res, next) => {
  const { uuid } = req.params;
  const { ids } = req.method === 'GET' ? req.query : req.body;

  if (!uuid || typeof uuid !== 'string') {
    LOGGER.error('uuid not provided.');
    res.status(400).send('`uuid` parameter is required.');
    return;
  }

  if (ids && typeof ids !== 'string') {
    LOGGER.error('ids parameter is invalid.');
    res.status(400).send('`ids` parameter is invalid.');
    return;
  }

  next();
});

router.get('/:uuid/fastas', require('./fastas'));
router.post('/:uuid/fastas', require('./fastas'));

router.get('/:uuid/annotations', require('./annotations'));
router.post('/:uuid/annotations', require('./annotations'));

router.post('/:uuid/:type-matrix', require('./matrix'));

router.post('/:uuid/core-allele-distribution', require('./core-allele-distribution'));

router.get('/:uuid/variance-summary', require('./variance-summary'));

router.post('/:uuid/speciator', require('./speciator'));

module.exports = router;
