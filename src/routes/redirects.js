const express = require('express');
const router = express.Router();

const LOGGER = require('utils/logging').createLogger('Redirects');

function redirectFromAlias(res, alias) {
  return res.redirect(`/collection/${alias}`);
}

router.use('/zika', (req, res) => redirectFromAlias(res, 'zika'));

router.use('/rensm/brynildsrud', (req, res) => redirectFromAlias(res, 'rensm-brynildsrud'));

router.use('/eurogasp2013', (req, res) => redirectFromAlias(res, 'eurogasp2013'));

router.use('/saureus/collection/:alias', (req, res) => {
  const { alias } = req.params;

  LOGGER.info(`Received request for old saureus collection: ${alias}`);

  redirectFromAlias(res, alias);
});

module.exports = router;
