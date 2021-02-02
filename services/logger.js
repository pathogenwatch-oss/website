const bunyan = require("bunyan");
const morgan = require("morgan");

const BASE_LOGGER_NAME = "PW";

function getDefaultLevel() {
  return process.env.LOG_LEVEL || bunyan.TRACE;
}

function createLogger(appendedName) {
  let loggerName = BASE_LOGGER_NAME;
  if (appendedName) {
    loggerName += ` ${appendedName.toUpperCase()}`;
  }
  return bunyan.createLogger({ name: loggerName, level: getDefaultLevel() });
}

/**
 * Caching a standard logger should be more efficient than creating multiple
 * loggers throughout the application.
 */
const BaseLogger = createLogger();
function getBaseLogger() {
  return BaseLogger;
}

function initHttpLogging(app, env) {
  getBaseLogger().warn(`Environment: ${env}`);
  if (env !== "development") {
    app.use(morgan(":date :method :url :status :response-time", {
      skip(req, res) {
        return (res.statusCode < 400);
      },
    }));
  } else {
    app.use(morgan("dev"));
    require("longjohn");
  }
}

module.exports = {
  BaseLogger,
  createLogger,
  getBaseLogger,
  initHttpLogging,
};
