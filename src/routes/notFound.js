var express = require('express');
var router = express.Router();

router.use(function (req, res) {
  res.sendStatus(404);
});

module.exports = router;
