const express = require('express');

const router = express.Router();

function prefilterValidation(req, res, next) {
  const { query = {}, user } = req;
  const { prefilter } = query;

  if (prefilter === 'user' || prefilter === 'bin') {
    if (!user || !user._id) {
      res.sendStatus(401);
      return;
    }
  }

  next();
}

router.use([
  prefilterValidation,
  require('./genome'),
  require('./collection'),
  require('./download'),
  require('./summary'),
  require('./organism'),
  require('./account'),
  require('./clustering'),
  require('../notFound'),
]);

module.exports = router;
