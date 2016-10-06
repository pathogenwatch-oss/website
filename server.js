var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var async = require('async');

var config = require('configuration.js');
var logging = require('utils/logging');
var storageConnection = require('utils/storageConnection');
var messageQueueConnection = require('utils/messageQueueConnection');

var LOGGER = logging.getBaseLogger();
var app = express();

var clientPath = path.join(__dirname, 'node_modules', 'wgsa-front-end');

app.set('port', process.env.PORT || config.node.port);
// http://stackoverflow.com/a/19965089
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.text({ limit: '500mb' }));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb',
}));

logging.initHttpLogging(app, process.env.NODE_ENV || 'development');

module.exports = function (callback) {
  async.parallel([
    storageConnection.connect,
    messageQueueConnection.connect,
  ], function (error) {
    if (error) {
      return callback(error, null);
    }

    // security
    app.use(function (req, res, next) {
      res.header('X-Frame-Options', 'SAMEORIGIN');
      res.header('X-XSS-Protection', '1; mode=block');
      res.header('X-Content-Type-Options', 'nosniff');
      next();
    });
    app.disable('x-powered-by');

    app.use(function (req, res, next) {
      res.header('X-Clacks-Overhead', 'GNU Terry Pratchett');
      next();
    });

    app.use(express.static(path.join(clientPath, 'public')));

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

    app.set('view engine', 'ejs');
    app.set('views', path.join(clientPath, 'views'));

    app.use('/', function (req, res, next) {
      // crude file matching
      if (req.path.match(/\.[a-z]{1,4}$/) || req.xhr) {
        return next();
      }

      return res.render('index', {
        googleMapsKey: config.googleMapsKey,
        frontEndConfig: {
          pusherKey: config.pusher.key,
          mapboxKey: config.mapboxKey,
          maxFastaFileSize: config.maxFastaFileSize,
        },
      });
    });

    app.use(require('routes/notFound'));

    require('errors.js')(app);

    const server = http.createServer(app).listen(app.get('port'), () => {
      LOGGER.info('✔ Express server listening on port ' + app.get('port'));

      process.on('SIGTERM', () => {
        LOGGER.info('Received stop signal (SIGTERM), shutting down gracefully');
        server.close(() => {
          LOGGER.info('Closed out remaining connections');
          process.exit();
        });
      });

      callback(null, app);
    });
  });
};
