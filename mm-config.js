const config = require('./config.json');

module.exports = {
  host: config.mongodb.hostname,
  port: config.mongodb.port,
  db: config.mongodb.database,
  collection: 'migrations',
  directory: 'migrations',
};
