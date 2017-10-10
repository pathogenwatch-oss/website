const path = require('path');

module.exports = function (filename) {
  return path.parse(path.basename(filename)).name;
};
