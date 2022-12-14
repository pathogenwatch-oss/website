const errors = require('utils/errors');

const LOGGER = require('utils/logging').createLogger('Error handler');

process.on('uncaughtException', (error) => {
  console.error(error);
  process.exit(1);
});

module.exports = function handleErrors(app) {
  app.use((error, req, res, next) => {
    LOGGER.error(error);

    // destroy request socket for all errors
    res.on('end', () => req.socket.destroy());

    if (errors.ServiceRequestErrorJSON.is(error)) {
      return res.status(400).json(error.format());
    }

    if (errors.ServiceRequestError.is(error)) {
      return res.sendStatus(400);
    }

    if (errors.NotFoundError.is(error)) {
      return res.sendStatus(404);
    }

    return res.sendStatus(500);
  });
};
