/* eslint es6: false */

var WebpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var express = require('express');
var bodyParser = require('body-parser');

var config = require('./webpack.config.js');

var server = new WebpackDevServer(webpack(config), {
  contentBase: '/public',
  stats: { colors: true, cached: false },
  hot: true
});

var apiRouter = express.Router();

server.use(bodyParser.json());

server.use(express.static('public'));

apiRouter.post('/species/:speciesId/collection', function (req, res) {
  res.json({
    collectionId: '123',
    userAssemblyIdToAssemblyIdMap: {
      'JH1.fna': '123',
      'JH9.fna': '456',
      'MW2.fna': '789'
    }
  });
});

apiRouter.post('/species/:speciesId/collection/:collectionId/assembly/:id', function (req, res) {
  res.json({ assemblyId: req.params.id });
});

apiRouter.get('/species/:speciesId/collection/:id', function (req, res) {
  res.sendFile(__dirname + '/static_data/collection.json');
});

apiRouter.get('/species/:speciesId/reference', function (req, res) {
  res.sendFile(__dirname + '/static_data/reference.json');
});

apiRouter.get('/species/:speciesId/reference', function (req, res) {
  res.sendFile(__dirname + '/static_data/reference.json');
});

apiRouter.post('/download/type/:idType/format/:fileFormat', function (req, res) {
  var assemblyId = Object.keys(req.body)[0];
  res.json(req.body[assemblyId]);
});

apiRouter.post('/download/file/:fileName', function (req, res) {
  return res.sendFile('./static_data/' + req.params.fileName);
});

server.use('/api', apiRouter);

server.use('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

server.listen(8080, "localhost");
