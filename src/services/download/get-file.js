const fs = require('fs');
const path = require('path');
const sanitize = require('sanitize-filename');

const config = require('configuration.js');

module.exports = function ({ filename }) {
  return fs.createReadStream(
    path.join(config.downloadFileLocation, sanitize(filename))
  );
};
