const express = require('express');
const path = require('path');
const crypto = require('crypto');

const version = require('../package.json').version;
const config = require('../services/configuration');
const organismConfigs = require('../universal/organisms');

const clientPath = path.join(__dirname, '..');

const isDevServer = (process.env.NODE_ENV === 'dev');

const devFiles = {
  scripts: [ '/dev.js' ],
  stylesheets: [],
};

function getFrontEndSettings(req) {
  let clientId = null;
  const limits = {
    maxCollectionSize: { default: config.maxCollectionSize },
    maxDownloadSize: config.maxDownloadSize,
  };

  organismConfigs
    .filter((organismConfig) => 'maxCollectionSize' in organismConfig)
    .forEach(({ id, maxCollectionSize }) => { limits.maxCollectionSize[id] = maxCollectionSize; });

  if (req.user) {
    const hash = crypto.createHash('sha1');
    hash.update(req.user.id);
    clientId = hash.digest('hex');
    if (req.user.limits) {
      for (const [ key, value ] of Object.entries(req.user.limits)) {
        // model will provide missing properties as undefined, should not overwrite.
        if (value) {
          limits[key] = value;
        }
      }
    }
  }

  const frontEndConfig = {
    clientId,
    mapboxKey: config.mapboxKey,
    maxCollectionSize: limits.maxCollectionSize,
    maxDownloadSize: limits.maxDownloadSize,
    maxGenomeFileSize: config.maxGenomeFileSize,
    maxReadsFileSize: config.maxReadsFileSize,
    pagination: config.pagination,
    pusher: {
      key: config.pusher.key,
      cluster: config.pusher.cluster,
    },
    strategies: Object.keys(config.passport.strategies || {}),
    user: req.user
      ? {
        name: req.user.name,
        email: req.user.email,
        photo: req.user.photo,
        admin: req.user.admin || undefined,
      }
      : undefined,
    version,
  };

  return frontEndConfig;
}

module.exports = function (app) {
  app.use(express.static(path.join(clientPath, 'public')));

  app.set('view engine', 'ejs');
  // app.set("views", path.join(clientPath, "views"));

  const files = isDevServer ? devFiles : require(path.join(clientPath, 'assets.js'))();

  app.use('/', (req, res, next) => {
    // crude file matching
    if ((req.path !== '/index.html' && req.path.match(/\.[a-z]{1,4}$/)) || req.xhr) {
      return next();
    }

    const frontEndConfig = getFrontEndSettings(req);

    return res.render('index', {
      files,
      gaTrackingId: config.gaTrackingId,
      frontEndConfig,
    });
  });
};
