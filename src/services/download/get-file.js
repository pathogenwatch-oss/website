const fs = require('fs');
const path = require('path');
const sanitize = require('sanitize-filename');

const config = require('configuration.js');

// TODO: need for download records? Can verify if request is legitimate without hitting file system.
module.exports = function ({ filename }) {
  return fs.createReadStream(
    path.join(config.downloadFileLocation, sanitize(filename))
  );
};
