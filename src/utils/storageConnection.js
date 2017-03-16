const couchbase = require('couchbase');

const appConfig = require('configuration');
const LOGGER = require('utils/logging').createLogger('Storage');

const DEFAULT_HOSTNAME = '127.0.0.1';
const HOSTNAMES = appConfig.couchbase.host || DEFAULT_HOSTNAME;
const ADDRESS = HOSTNAMES;
// var ADDRESS = 'couchbase://' + HOSTNAMES;

function createBucketConnection(config, cluster) {
  const bucketName = config.name;
  const password = config.password;

  LOGGER.info(`Connecting to bucket: ${bucketName}`);
  return new Promise((resolve, reject) => {
    const bucket = cluster.openBucket(bucketName, password, error => {
      if (error) {
        LOGGER.error(`✗ ${error} ${bucketName}`);
        return reject(error);
      }
      LOGGER.info(`✔ Connected to "${bucketName}" bucket`);
      bucket.connectionTimeout = 60000;
      bucket.operationTimeout = 60000;
      return resolve(bucket);
    });
  });
}

const connections = {};
function connect() {
  const config = appConfig.couchbase.buckets;
  const cluster = new couchbase.Cluster(ADDRESS);

  return Promise.all(
    Object.keys(config).map(key =>
      createBucketConnection(config[key], cluster).
        then(bucket => { connections[key] = bucket; })
    )
  );
}

function getConnections() {
  return connections;
}

module.exports.connect = connect;
module.exports.getConnections = getConnections;
