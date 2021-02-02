const express = require("express");
const path = require("path");

const config = require("../services/configuration");

const clientPath = path.join(__dirname, "..", "front-end");

const getFrontEndSettings = require("./get-front-end-settings");

module.exports = function (app) {
  app.use(express.static(path.join(clientPath, "public")));

  app.set("view engine", "ejs");
  // app.set("views", path.join(clientPath, "views"));

  const files = require(path.join(clientPath, "assets.js"))();
  app.use("/", (req, res, next) => {
    // crude file matching
    if ((req.path !== "/index.html" && req.path.match(/\.[a-z]{1,4}$/)) || req.xhr) {
      return next();
    }

    const frontEndConfig = getFrontEndSettings(req);

    return res.render("index", {
      files,
      gaTrackingId: config.gaTrackingId,
      frontEndConfig,
    });
  });
};
