/* eslint es6: false */

var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");

var config = require('./webpack.config.js');

var server = new WebpackDevServer(webpack(config), {
  stats: { colors: true, cached: false },
  hot: true
});

server.use('/api/species/:speciesId/reference', function (req, res) {
  res.sendFile(__dirname + '/static_data/reference.json');
});

server.app.post('/api/species/:speciesId/collection', function (req, res) {
  res.json({
    collectionId: '123',
    fileAssemblyIdToAssemblyIdMap: {
      'JH1.fna': '123',
      'JH9.fna': '456',
      'MW2.fna': '789',
    }
  });
});

server.use('/api/species/:speciesId/collection/:id', function (req, res) {
  res.sendFile(__dirname + '/static_data/collection.json');
});

server.use('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(8080, "localhost");
