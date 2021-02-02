const fs = require("fs");
const path = require("path");
const mergeOptions = require("merge-options");

let config = require(path.resolve(".", "defaults.json"));

if (fs.existsSync(path.resolve(".", "config.json"))) {
  config = mergeOptions(config, require(path.resolve(".", "config.json")));
}

module.exports = config;
