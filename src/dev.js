module.exports = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Uncomment when testing upload page, comment out when testing user accounts
  // req.sessionID = 'development';

  next();
};
