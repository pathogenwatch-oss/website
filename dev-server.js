/* eslint es6: false */

var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");

var config = require('./webpack.config.js');

var server = new WebpackDevServer(webpack(config), {
  stats: { colors: true, cached: false },
  hot: true
});

server.use('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(8080, "localhost");
