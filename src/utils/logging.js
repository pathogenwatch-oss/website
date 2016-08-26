var bunyan = require('bunyan');
var morgan = require('morgan');

var BASE_LOGGER_NAME = 'WGSA';

function getDefaultLevel() {
  if (process.env.NODE_ENV === 'testing') {
    return bunyan.FATAL;
  }
  return bunyan.TRACE;
}

function createLogger(appendedName) {
  var loggerName = BASE_LOGGER_NAME;
  if (appendedName) {
    loggerName += ' ' + appendedName.toUpperCase();
  }
  return bunyan.createLogger({ name: loggerName, level: getDefaultLevel() });
}

/**
 * Caching a standard logger should be more efficient than creating multiple
 * loggers throughout the application.
 */
var BASE_LOGGER = createLogger();
function getBaseLogger() {
  return BASE_LOGGER;
}

function initHttpLogging(app, env) {
  getBaseLogger().warn('Environment: ' + env);
  if (env !== 'development') {
    app.use(morgan(':date :method :url :status :response-time', {
      skip(req, res) {
        return (res.statusCode < 400);
      },
    }));
  } else {
    app.use(morgan('dev'));
    require('longjohn');
  }
}

module.exports = {
  createLogger,
  getBaseLogger,
  initHttpLogging,
};
