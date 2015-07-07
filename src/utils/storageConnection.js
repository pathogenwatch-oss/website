var couchbase = require('couchbase');
var async = require('async');

var appConfig = require('configuration');
var LOGGER = require('utils/logging').createLogger('Storage');

var DEFAULT_HOSTNAME = '127.0.0.1';
var HOSTNAME = appConfig.server.couchbase.ip || DEFAULT_HOSTNAME;
var ADDRESS = 'http://' + HOSTNAME + ':8091';

function createBucketConnection(config, cluster, callback) {
  var bucketName = config.name;
  var password = config.password;

  LOGGER.info('Connecting to bucket: ' + bucketName + ' ' + password);
  var bucket = cluster.openBucket(bucketName, password,
    function (error) {
      if (error) {
        LOGGER.error('✗ ' + error + ' ' + bucketName);
        return callback(error, null);
      }
      LOGGER.info('✔ Connected to "' + bucketName + '" bucket');
      bucket.connectionTimeout = 60000;
      bucket.operationTimeout = 60000;
      callback(null, bucket);
    }
  );
}

var connections = {};
function connect(callback) {
  var config = appConfig.server.couchbase.buckets;
  var cluster = new couchbase.Cluster(ADDRESS);

  async.each(
    Object.keys(config),
    function (key, iterationFinished) {
      createBucketConnection(config[key], cluster, function (error, bucket) {
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
