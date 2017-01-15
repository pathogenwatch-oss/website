const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoSessionStore = require('connect-mongo')(session);
const userAccounts = require('cgps-user-accounts/src');
const userStore = require('utils/userStore');
const http = require('http');
const path = require('path');
const async = require('async');

const config = require('configuration.js');
const logging = require('utils/logging');
const storageConnection = require('utils/storageConnection');
const messageQueueConnection = require('utils/messageQueueConnection');
const mongoConnection = require('utils/mongoConnection');

const LOGGER = logging.getBaseLogger();
const app = express();

if (config.node.auth) {
  const auth = require('http-auth');
  const { realm, file } = config.node.auth;
  const basic = auth.basic({ realm, file });
  app.use(auth.connect(basic));
}

const clientPath = path.join(__dirname, 'node_modules', 'wgsa-front-end');

app.set('port', process.env.PORT || config.node.port);
// http://stackoverflow.com/a/19965089
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb',
}));

logging.initHttpLogging(app, process.env.NODE_ENV || 'development');

module.exports = (callback) => {
  async.parallel([
    storageConnection.connect,
    messageQueueConnection.connect,
    mongoConnection.connect,
  ], (error) => {
    if (error) {
      callback(error, null);
      return;
    }

    // security
    app.use((req, res, next) => {
      res.header('X-Frame-Options', 'SAMEORIGIN');
      res.header('X-XSS-Protection', '1; mode=block');
      res.header('X-Content-Type-Options', 'nosniff');
      next();
    });
    app.disable('x-powered-by');

    app.use((req, res, next) => {
      res.header('X-Clacks-Overhead', 'GNU Terry Pratchett');
      next();
    });

    // required for passport.js
    app.use(cookieParser());
    app.use(
      session({
        secret: config.node.sessionSecret,
        store: new MongoSessionStore({ url: mongoConnection.dbUrl }),
        resave: true,
        saveUninitialized: true,
      })
    );

    // user accounts
    userAccounts(app, {
      userStore,
      url: config.passport.url,
      authPath: '/auth',
      successRedirect: '/',
      failureRedirect: '/',
      logoutPath: '/signout',
      strategies: config.passport.strategies,
    });

    app.use(express.static(path.join(clientPath, 'public')));

    // CORS
    app.use((req, res, next) => {
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

    app.use('/', (req, res, next) => {
      // crude file matching
      if (req.path.match(/\.[a-z]{1,4}$/) || req.xhr) {
        return next();
      }
      const user = req.user ?
        { name: req.user.name, email: req.user.email, photo: req.user.photo } :
        null;
      return res.render('index', {
        googleMapsKey: config.googleMapsKey,
        frontEndConfig: {
          pusherKey: config.pusher.key,
          mapboxKey: config.mapboxKey,
          maxFastaFileSize: config.maxFastaFileSize,
          wiki: config.wikiLocation,
          strategies: [ 'facebook', 'google', 'twitter' ],
          user,
        },
      });
    });

    app.use(require('routes/notFound'));

    require('errors.js')(app);

    const server = http.createServer(app).listen(app.get('port'), () => {
      LOGGER.info(`✔ Express server listening on port ${app.get('port')}`);

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
