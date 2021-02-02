const bodyParser = require("body-parser");

module.exports = function (app) {
  // http://stackoverflow.com/a/19965089
  app.use(
    bodyParser.json({ limit: "8mb" })
  );
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: "8mb",
    })
  );
};
