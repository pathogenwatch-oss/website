/* eslint-disable react-hooks/rules-of-hooks */

const config = require('../services/configuration');
const mongoConnection = require('../src/utils/mongoConnection');

const addErrorHandling = require("./error-handling");
const addSecurityHeaders = require("./security-headers");
const apiRoutes = require("../src/routes");
const createHttpServer = require("./create-http-server");
const gracefulShutdown = require("./graceful-shutdown");
const initHttpLogging = require("./init-http-logging");
const staticFilesMiddleware = require("./static-files-middleware");
const useRequestBodyMiddleware = require("./request-body-middleware");
const useUserAccounts = require("./user-accounts");

module.exports = function (app) {
  app.set("port", process.env.PORT || config.node.port);

  initHttpLogging(app);

  gracefulShutdown(app);

  useRequestBodyMiddleware(app);

  addSecurityHeaders(app);

  useUserAccounts(app);

  apiRoutes(app);

  staticFilesMiddleware(app);

  addErrorHandling(app);

  const server = createHttpServer(app);

  const startupConnections = [
    mongoConnection.connect(),
  ];

  return (
    Promise.all(startupConnections)
      .then(
        () => server.listen(
          app.get("port"),
          () => app.logger.info(`✔ Express server listening on port ${app.get("port")}`)
        )
      )
      .then(() => server)
  );
};
