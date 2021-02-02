const logging = require("../services/logger");

module.exports = function (app) {
  logging.initHttpLogging(app, process.env.NODE_ENV || "none");

  app.logger = logging.getBaseLogger();
};
