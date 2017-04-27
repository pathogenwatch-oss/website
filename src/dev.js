const { dev = {} } = require('configuration');

module.exports = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Copy your session id from the database
  req.sessionID = dev.sessionID || 'development';

  next();
};
