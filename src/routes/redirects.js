const express = require('express');
const router = express.Router();

const services = require('services');

const LOGGER = require('utils/logging').createLogger('Redirects');

function redirectFromAlias(res, alias) {
  return (
    services.request('collection', 'alias', { alias })
      .then((uuid = alias) => res.redirect(`/collection/${uuid}`))
  );
}

router.use('/zika', (req, res) => redirectFromAlias(res, 'zika'));

router.use(
  '/rensm/brynildsrud',
  (req, res) => redirectFromAlias(res, 'rensm-brynildsrud')
);

router.use('/saureus/collection/:alias', (req, res) => {
  const { alias } = req.params;

  LOGGER.info(`Received request for old saureus collection: ${alias}`);

  redirectFromAlias(res, alias);
});

module.exports = router;
