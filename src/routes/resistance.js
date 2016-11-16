const async = require('async');
const express = require('express');
const router = express.Router();

const antibioticModel = require('models/antibiotic');
const paarsnpModel = require('models/paarsnp');

const LOGGER = require('utils/logging').createLogger('Resistance');

router.get('/species/:id/resistance', (req, res) => {
  async.parallel([
    done => antibioticModel.get(req.params.id, done),
    done => paarsnpModel.get(req.params.id, done),
  ], (error, [ antibiotics, { paar, snp } ]) => {
    if (error) {
      LOGGER.error(error, antibiotics);
      return res.sendStatus(500);
    }
    return res.json({ antibiotics, paar, snp });
  });
});

module.exports = router;
