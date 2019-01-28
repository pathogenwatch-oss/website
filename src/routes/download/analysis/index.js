const express = require('express');
const router = express.Router();

const LOGGER = require('utils/logging').createLogger('Downloads');

router.post('/:task', (req, res, next) => {
  const { ids } = req.body;
  if (!ids || typeof ids !== 'string' || ids === '') {
    LOGGER.error('Missing ids');
    return res.sendStatus(400);
  }
  return next();
});

router.post('/cgmlst', require('./cgmlst'));
router.post('/genotyphi', require('./genotyphi'));
router.post('/inctyper', require('./inctyper'));
router.post('/kleborate', require('./kleborate'));
router.post('/metrics', require('./metrics'));
router.post('/mlst', require('./mlst'));
router.post('/ngmast', require('./ngmast'));
router.post('/paarsnp', require('./paarsnp'));
router.post('/paarsnp-snps-genes', require('./paarsnp-snps-genes'));
router.post('/speciator', require('./speciator'));

module.exports = router;
