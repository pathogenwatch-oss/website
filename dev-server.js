const fs = require('fs');

const webpack = require('webpack');
const express = require('express');
const bodyParser = require('body-parser');
const fastaStorage = require('wgsa-fasta-store');

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

const getCollectionPath = species => `${__dirname}/static_data/${species}`;

const apiRouter = express.Router();

apiRouter.post('/species/:speciesId/collection', (req, res) => {
  res.json({
    collectionId: '123',
    assemblyNameToAssemblyIdMap: {
      '7065_8#1_scaffolded': '123',
      '7065_8#2_scaffolded': '456',
      '7065_8#3_scaffolded': '789',
    },
  });
});

apiRouter.post('/species/:speciesId/collection/:collectionId/assembly/:id',
  (req, res) => res.json({ assemblyId: req.params.id })
);

apiRouter.get('/species/:speciesId/collection/:id/status', (req, res) => {
  res.json({ status: 'READY' });
});

apiRouter.get('/species/:speciesId/collection/:id', (req, res) => {
  setTimeout(() => {
    res.sendFile(`${getCollectionPath(req.params.speciesId)}/collection.json`);
  }, 0);
});

apiRouter.get('/species/:speciesId/reference', (req, res) => {
  res.sendFile(`${getCollectionPath(req.params.speciesId)}/reference.json`);
});

apiRouter.get('/species/:speciesId/resistance', (req, res) => {
  res.sendFile(`${getCollectionPath(req.params.speciesId)}/resistance.json`);
});

// let subtreeError = false;
apiRouter.get('/species/:speciesId/collection/:collectionId/subtree/:subtreeId',
  (req, res) => {
    // subtreeError = !subtreeError;
    setTimeout(() => (
      // subtreeError ?
      //   res.sendStatus(500) :
        res.sendFile(`${getCollectionPath(req.params.speciesId)}/${req.params.subtreeId}.json`)
    ), 1000);
  }
);

apiRouter.post('/species/:speciesId/download/type/assembly/format/fasta', (req, res) => {
  setTimeout(() => {
    res.json({ checksum: `${req.body.idList[0]}.fa` });
  }, 1000);
});

let downloadError = false;
apiRouter.post('/species/:speciesId/download/type/:idType/format/:fileFormat', (req, res) => {
  downloadError = !downloadError;
  setTimeout(() => (
    downloadError ?
      res.sendStatus(500) :
      res.json({ checksum: req.params.fileFormat })
  ), 1000);
});

apiRouter.get(
  '/species/:speciesId/download/file/:fileName',
  (req, res) => res.sendFile(`${getCollectionPath(req.params.speciesId)}/metadata.csv`)
);

const fastaStoragePath = './fastas';
fastaStorage.setup(fastaStoragePath);

let uploadError = false;
apiRouter.post('/upload', (req, res, next) => {
  // uploadError = !uploadError;
  return uploadError ?
    setTimeout(() => res.sendStatus(500), 500) :
    fastaStorage.store(fastaStoragePath, req)
      .then(({ fileId, metrics, specieator: { taxId, scientificName } }) => {
        res.json({
          id: fileId,
          speciesId: taxId,
          speciesName: scientificName,
          metrics,
        });
      }).
      catch(error => next(error));
});

apiRouter.post('/collection', (req, res) =>
  setTimeout(() => res.json({ collectionId: '123' }), 2000)
);

app.use('/api', apiRouter);

app.set('view engine', 'ejs');

const WGSA_VERSION = require('./package.json').version;
app.use('/', (req, res) => res.render('index', {
  frontEndConfig: Object.assign(
    JSON.parse(fs.readFileSync('./config.json')),
    { WGSA_VERSION }
  ),
}));

app.listen(process.env.PORT || 8080, '0.0.0.0');
