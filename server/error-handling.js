const logging = require("../services/logger");
const errors = require("../services/errors");

const logger = logging.getBaseLogger();

process.on("uncaughtException", (error) => {
  logger.error(error);
  process.exit(1);
});

module.exports = function (app) {
  app.use((_, res) => res.sendStatus(404));

  app.use((error, req, res, _) => {
    logger.error(error);

    // destroy request socket for all errors
    res.on("end", () => req.socket.destroy());

    if (errors.ServiceRequestErrorJSON.is(error)) {
      res.status(400).json(error.format());
    }
    else if (errors.ServiceRequestError.is(error)) {
      res.status(400).send(error.message);
    }
    else if (errors.NotFoundError.is(error)) {
      res.sendStatus(404);
    }
    else {
      res.sendStatus(500);
    }
  });
};
