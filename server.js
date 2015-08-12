var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var async = require('async');

var appConfig = require('configuration');
var logging = require('utils/logging');
var storageConnection = require('utils/storageConnection');
var messageQueueConnection = require('utils/messageQueueConnection');

var LOGGER = logging.getBaseLogger();
var app = express();

app.set('port', process.env.PORT || appConfig.server.node.port);
// http://stackoverflow.com/a/19965089
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));

logging.initHttpLogging(app, process.env.NODE_ENV || 'development');

module.exports = function (callback) {
  var server;

  async.parallel([
    storageConnection.connect,
    messageQueueConnection.connect
  ], function (error) {
    if (error) {
      return callback(error, null);
    }

    app.use(express.static(path.join(__dirname, 'public')));

    // Set our own x-powered-by header
    app.use(function (req, res, next) {
      res.header('X-powered-by', 'Blood, sweat, and tears');
      next();
    });

    // CORS
    app.use(function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      );
      next();
    });

    require('routes.js')(app);
    require('controllers/error').handleErrors(app);

    server = http.createServer(app).listen(app.get('port'), function () {
      LOGGER.info('✔ Express server listening on port ' + app.get('port'));
      require('services/socket').connect(server);
      callback(null, app);
    });
  });
};
