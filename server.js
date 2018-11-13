const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoSessionStore = require('connect-mongo')(session);
const userAccounts = require('cgps-user-accounts/src');
const userStore = require('utils/userStore');
const http = require('http');
const path = require('path');
const crypto = require('crypto');

const config = require('configuration.js');
const logging = require('utils/logging');
const mongoConnection = require('utils/mongoConnection');

const LOGGER = logging.getBaseLogger();
const app = express();

const clientPath = path.join(__dirname, 'node_modules', 'pathogenwatch-front-end');

let version = '';
if (process.env.NODE_ENV === 'production') {
  version = process.env.PW_VERSION;
} else {
  version = require('./package.json').version;
}

app.set('port', process.env.PORT || config.node.port);

let shuttingDown = false;
app.use((req, res, next) => {
  if (shuttingDown) {
    res.header('Connection', 'close');
    res.status(502).send('Server is shutting down');
    return;
  }
  next();
});

// http://stackoverflow.com/a/19965089
app.use(bodyParser.json({ limit: '8mb' }));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '8mb',
}));

logging.initHttpLogging(app, process.env.NODE_ENV || 'none');

module.exports = () =>
  mongoConnection.connect()
  .then(() => {
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

    if (process.env.NODE_ENV === 'development') {
      app.use(require('./src/dev'));
    }

    app.use((req, res, next) => {
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
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

    require('routes')(app);

    app.set('view engine', 'ejs');
    app.set('views', path.join(clientPath, 'views'));

    const files = require(path.join(clientPath, 'assets.js'))();
    app.use('/', (req, res, next) => {
      // crude file matching
      if (req.path !== '/index.html' && req.path.match(/\.[a-z]{1,4}$/) || req.xhr) {
        return next();
      }
      const user = req.user ?
        { name: req.user.name,
          email: req.user.email,
          photo: req.user.photo,
          admin: req.user.admin || undefined,
        } :
        undefined;

      let clientId = null;
      if (req.user) {
        const hash = crypto.createHash('sha1');
        hash.update(req.user.id);
        clientId = hash.digest('hex');
      }

      return res.render('index', {
        files,
        gaTrackingId: config.gaTrackingId,
        frontEndConfig: {
          pusherKey: config.pusher.key,
          mapboxKey: config.mapboxKey,
          maxCollectionSize: config.maxCollectionSize,
          maxDownloadSize: config.maxDownloadSize,
          maxGenomeFileSize: config.maxGenomeFileSize,
          pagination: config.pagination,
          wiki: config.wikiLocation,
          strategies: Object.keys(config.passport.strategies || {}),
          user,
          version,
          clientId,
        },
      });
    });

    app.use(require('routes/notFound'));

    require('errors.js')(app);

    const server = http.createServer(app).listen(app.get('port'), () => {
      LOGGER.info(`✔ Express server listening on port ${app.get('port')}`);

      process.on('SIGTERM', () => {
        shuttingDown = true;
        LOGGER.info('Received stop signal (SIGTERM), shutting down gracefully');
        Promise.all([
          mongoConnection.close(),
          new Promise((resolve) => server.close(resolve)),
        ]).then(() => {
          LOGGER.info('Closed out remaining connections');
          process.exit();
        });
      });

      return app;
    });
  });
