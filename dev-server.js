const webpack = require('webpack');
const express = require('express');
const bodyParser = require('body-parser');

const config = require('./webpack.config.js');
const compiler = webpack(config);

const app = express();

app.use(require('webpack-dev-middleware')(compiler, {
  contentBase: '/public',
  publicPath: config.output.publicPath,
  stats: { colors: true, cached: false },
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(bodyParser.json());

app.use(express.static('public'));


const apiRouter = express.Router();

apiRouter.post('/species/:speciesId/collection', function (req, res) {
  res.json({
    collectionId: '123',
    assemblyNameToAssemblyIdMap: {
      '7065_8#1_scaffolded': '123',
      '7065_8#2_scaffolded': '456',
      '7065_8#3_scaffolded': '789',
    },
  });
});

apiRouter.post('/species/:speciesId/collection/:collectionId/assembly/:id', function (req, res) {
  res.json({ assemblyId: req.params.id });
});

apiRouter.get('/species/:speciesId/collection/:id', function (req, res) {
  setTimeout(function () {
    res.sendFile(__dirname + '/static_data/collection.json');
  }, 2000);
});

apiRouter.get('/species/:speciesId/reference', function (req, res) {
  res.sendFile(__dirname + '/static_data/reference.json');
});

apiRouter.get('/species/:speciesId/antibiotics', function (req, res) {
  res.sendFile(__dirname + '/static_data/antibiotics.json');
});

apiRouter.post('/download/type/assembly/format/fasta', function (req, res) {
  setTimeout(function () {
    res.json({
      'gobbledegook': req.body.idList[0] + '.fa',
    });
  }, 2000);
});

apiRouter.post('/download/type/:idType/format/:fileFormat', function (req, res) {
  setTimeout(function () {
    res.json({
      'gobbledegook': req.params.fileFormat,
    });
  }, 2000);
});

apiRouter.get('/download/file/:fileName', function (req, res) {
  return res.sendFile(__dirname + '/static_data/' + req.params.fileName);
});

app.use('/api', apiRouter);

app.use('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(8080);
