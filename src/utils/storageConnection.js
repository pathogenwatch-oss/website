const couchbase = require('couchbase');
const async = require('async');

const appConfig = require('configuration');
const LOGGER = require('utils/logging').createLogger('Storage');

const DEFAULT_HOSTNAME = '127.0.0.1';
const HOSTNAMES = appConfig.couchbase.ip || DEFAULT_HOSTNAME;
const ADDRESS = HOSTNAMES;
// var ADDRESS = 'couchbase://' + HOSTNAMES;

function createBucketConnection(config, cluster, callback) {
  const bucketName = config.name;
  const password = config.password;

  LOGGER.info(`Connecting to bucket: ${bucketName}`);
  const bucket = cluster.openBucket(bucketName, password, (error) => {
    if (error) {
      LOGGER.error(`✗ ${error} ${bucketName}`);
      return callback(error, null);
    }
    LOGGER.info(`✔ Connected to "${bucketName}" bucket`);
    bucket.connectionTimeout = 60000;
    bucket.operationTimeout = 60000;
    callback(null, bucket);
  });
}

const connections = {};
function connect(callback) {
  const config = appConfig.couchbase.buckets;
  const cluster = new couchbase.Cluster(ADDRESS);

  async.each(
    Object.keys(config),
    (key, iterationFinished) => {
      createBucketConnection(config[key], cluster, (error, bucket) => {
        if (error) {
          return iterationFinished(error);
        }
        connections[key] = bucket;
        iterationFinished();
      });
    },
    callback
  );
}

function getConnections() {
  return connections;
}

module.exports.connect = connect;
module.exports.getConnections = getConnections;
