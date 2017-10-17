const fs = require('fs');

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

apiRouter.get('/collection/summary', (req, res) => {
  setTimeout(() => {
    res.sendFile(`${__dirname}/static_data/collection-summary.json`);
  }, 0);
});

apiRouter.get('/collection/:id', (req, res) => {
  setTimeout(() => {
    res.sendFile(`${getCollectionPath(req.params.id)}/collection.json`);
  }, 0);
});

apiRouter.get('/collection', (req, res) => {
  setTimeout(() => {
    res.sendFile(`${__dirname}/static_data/collections.json`);
  }, 0);
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

apiRouter.post('/collection', (req, res) =>
  setTimeout(() => res.json({ collectionId: '123' }), 2000)
);

app.use('/api', apiRouter);

app.set('view engine', 'ejs');

app.use('/', (req, res) => res.render('index', {
  frontEndConfig: JSON.parse(fs.readFileSync('./config.json')),
}));

app.listen(process.env.PORT || 8080, '0.0.0.0');
