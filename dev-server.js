/* eslint es6: false */

var webpack = require("webpack");
var express = require("express");

var config = require('./webpack.config.js');
var compiler = webpack(config);

var app = express();

app.use(require('webpack-dev-middleware')(compiler, {
  contentBase: '/public',
  publicPath: config.output.publicPath,
  stats: { colors: true, cached: false }
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static('public'));

app.post('/api/species/:speciesId/collection', function (req, res) {
  res.json({
    collectionId: '123',
    userAssemblyIdToAssemblyIdMap: {
      'JH1.fna': '123',
      'JH9.fna': '456',
      'MW2.fna': '789'
    }
  });
});

app.post('/api/species/:speciesId/collection/:collectionId/assembly/:id', function (req, res) {
  res.json({ assemblyId: req.params.id });
});

app.get('/api/species/:speciesId/collection/:id', function (req, res) {
  res.sendFile(__dirname + '/static_data/collection.json');
});

app.get('/api/species/:speciesId/reference', function (req, res) {
  res.sendFile(__dirname + '/static_data/reference.json');
});

app.use('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(8080, "localhost");
