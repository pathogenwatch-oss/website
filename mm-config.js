const { dbUrl } = require('./src/utils/mongoConnection.js');

module.exports = {
  url: dbUrl,
  collection: 'migrations',
  directory: 'migrations',
};
