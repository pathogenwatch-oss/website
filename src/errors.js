var LOGGER = require('utils/logging').createLogger('Error handler');

var errorCodes = {
  KEY_DOES_NOT_EXIST: 13
};

function notAServerError(error) {
  return (
    error.code === errorCodes.KEY_DOES_NOT_EXIST
  );
}

module.exports = function handleErrors(app) {
  app.use(function (error, req, res, next) {
    LOGGER.error(error);
    if (notAServerError(error)) {
      // continue routing
      return next();
    }
    res.sendStatus(500);
  });
};
