const express = require('express');

const router = express.Router();

const services = require('services');

const LOGGER = require('utils/logging').createLogger('Summary');

router.use('/account', (req, res, next) => {
  const { user } = req;

  if (!user || !user._id) {
    res.sendStatus(401);
    return;
  }

  next();
});

router.get('/account/activity', (req, res, next) => {
  LOGGER.info('Received request to get user activity');

  const { user } = req;
  services.request('account', 'activity', { user })
    .then((response) => res.json(response))
    .catch(next);
});

router.get('/account/whoami', (req, res, next) => {
  LOGGER.info('Received request to get user');

  const { user } = req;
  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      lastUpdatedAt: user.lastUpdatedAt,
      lastAccessedAt: user.lastAccessedAt,
      createdAt: user.createdAt,
      providerType: user.providerType,
    },
  });
});

module.exports = router;
