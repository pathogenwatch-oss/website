const { ServiceRequestError } = require('./utils/errors');

const LOGGER = require('utils/logging').createLogger('Error handler');

const errorCodes = {
  KEY_DOES_NOT_EXIST: 13,
};

function isNotFoundInStorage(error) {
  return (
    error.code === errorCodes.KEY_DOES_NOT_EXIST
  );
}

process.on('uncaughtException', error => {
  console.error(error);
  process.exit(1);
});

module.exports = function handleErrors(app) {
  app.use((error, req, res, next) => {
    LOGGER.error(error);

    if (ServiceRequestError.is(error)) {
      return res.sendStatus(400);
    }

    if (isNotFoundInStorage(error)) {
      return res.sendStatus(404);
    }

    res.sendStatus(500);
    req.socket.destroy();
  });
};
