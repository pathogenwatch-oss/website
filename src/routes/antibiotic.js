var express = require('express');
var router = express.Router();

var antibioticModel = require('models/antibiotic');

var LOGGER = require('utils/logging').createLogger('Antibiotics');

router.get('/species/:id/antibiotics', function (req, res) {
  antibioticModel.get(req.params.id, function (error, antibiotics) {
    if (error) {
      LOGGER.error(error, antibiotics);
      return res.sendStatus(500);
    }
    res.json(antibiotics);
  });
});

module.exports = router;
