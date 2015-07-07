var express = require('express');
var router = express.Router();

router.use(function (req, res) {
  res.status(404);
  return res.render('404'); // renders 404 page
});

module.exports = router;
