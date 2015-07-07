var uuid = require('node-uuid');

var appConfig = require('configuration');
var feedbackStorage = require('services/storage')('feedback');

var LOGGER = require('utils/logging').createLogger('Landing');

function landing(req, res) {
  res.render('landing', {
    appConfig: JSON.stringify(appConfig.client)
  });
}

function feedback(req, res) {
  LOGGER.info('Received feedback:');

  var feedbackData = {
    name: req.body.name,
    email: req.body.email,
    feedback: req.body.feedback
  };

  var feedbackKey = 'FEEDBACK_' + uuid.v4();

  LOGGER.info('Inserting feedback with key: ' + feedbackKey);

  feedbackStorage.store(feedbackKey, feedbackData, function (error) {
    if (error) {
      LOGGER.error(error);
      res.status(500).json({ error: 'Could not save provided feedback' });
      return;
    }

    LOGGER.info('Inserted feedback');
    res.json({});
  });
}

function subscribe(req, res) {
  LOGGER.info('Received subscription:');

  var subscription = {
    email: req.body.email
  };

  if (typeof subscription.email === 'undefined' || subscription.email === '') {
    LOGGER.error('No email');
    res.status(500).json({ error: 'No email address were provided' });
    return;
  }

  subscription.email = subscription.email.toLowerCase();

  var subscriptionKey = 'SUBSCRIBE_' + subscription.email;
  LOGGER.info('Inserting subscription with key: ' + subscriptionKey);

  feedbackStorage.store(subscriptionKey, subscription, function (error) {
    if (error) {
      LOGGER.error(error);
      res.status(500).json({ error: 'Could not insert subscription' });
      return;
    }

    LOGGER.info('Inserted subscription');
    res.json({});
  });
}

module.exports.landing = landing;
module.exports.feedback = feedback;
module.exports.subscribe = subscribe;
