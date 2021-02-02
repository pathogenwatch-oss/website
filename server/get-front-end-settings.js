const crypto = require("crypto");

const config = require("../services/configuration");

const version = require('../package.json').version;

module.exports = function getFrontEndSettings(req) {
  let clientId = null;
  const limits = {
    maxCollectionSize: config.maxCollectionSize,
    maxDownloadSize: config.maxDownloadSize,
  };

  if (req.user) {
    const hash = crypto.createHash('sha1');
    hash.update(req.user.id);
    clientId = hash.digest('hex');
    if (req.user.limits) {
      for (const [ key, value ] of Object.entries(req.user.limits)) {
        // model will provide missing properties as undefined, should not overwrite.
        if (!!value) {
          limits[key] = value;
        }
      }
    }
  }

  const frontEndConfig = {
    assemblerAddress: config.assemblerAddress,
    clientId,
    mapboxKey: config.mapboxKey,
    maxCollectionSize: limits.maxCollectionSize,
    maxDownloadSize: limits.maxDownloadSize,
    maxGenomeFileSize: config.maxGenomeFileSize,
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
};
