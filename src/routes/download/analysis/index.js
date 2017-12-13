const express = require('express');
const router = express.Router();

const LOGGER = require('utils/logging').createLogger('Downloads');

router.post('/:task', (req, res, next) => {
  const { ids } = req.body;
  if (!ids || typeof (ids) !== 'string' || ids === '') {
    LOGGER.error('Missing ids');
    return res.sendStatus(400);
  }
  return next();
});

router.post('/mlst', require('./mlst'));

router.post('/speciator', require('./speciator'));

router.post('/paarsnp', require('./paarsnp'));

router.post('/genotyphi', require('./genotyphi'));

router.post('/ngmast', require('./ngmast'));

router.post('/cgmlst', require('./cgmlst'));

router.post('/mlst', require('./mlst'));

module.exports = router;
