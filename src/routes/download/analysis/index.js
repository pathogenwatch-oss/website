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
router.post('/mlst', require('./mlst')('mlst'));
router.post('/mlst2', require('./mlst')('mlst2'));
router.post('/ngmast', require('./ngmast'));
router.post('/ngstar', require('./mlst')('ngstar'));
router.post('/paarsnp', require('./paarsnp'));
router.post('/paarsnp-snps-genes', require('./paarsnp-snps-genes'));
router.post('/poppunk', require('./poppunk'));
router.post('/serotype', require('./serotype'));
router.post('/spn-pbp-amr', require('./spn-pbp-amr'));
router.post('/speciator', require('./speciator'));

module.exports = router;
