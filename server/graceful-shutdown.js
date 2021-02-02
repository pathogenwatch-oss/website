const logging = require("../services/logger");
const mongoConnection = require('utils/mongoConnection');

const logger = logging.getBaseLogger();
let shuttingDown = false;

module.exports = function (app) {

  app.use((req, res, next) => {
    if (shuttingDown) {
      res.header("Connection", "close");
      res.status(502).send("Server is shutting down");
      return;
    }
    next();
  });

  process.on("SIGTERM", () => {
    shuttingDown = true;
    logger.info("Received stop signal (SIGTERM), shutting down gracefully");
    Promise.all([
      mongoConnection.close(),
      app.close(),
    ])
      .then(() => {
        logger.info("Closed out remaining connections");
        process.exit();
      });
  });

};

