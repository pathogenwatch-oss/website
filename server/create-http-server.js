const http = require("http");

module.exports = function (app) {
  const server = http.createServer(app);

  app.close = function () {
    return new Promise((resolve) => server.close(resolve));
  };

  return server;
};
