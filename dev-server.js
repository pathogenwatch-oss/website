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
    res.sendFile(`${__dirname}/static_data/collection.json`);
  }, 1000);
});

apiRouter.get('/species/:speciesId/reference', (req, res) => {
  res.sendFile(`${__dirname}/static_data/reference.json`);
});

apiRouter.get('/species/:speciesId/antibiotics', (req, res) => {
  res.sendFile(`${__dirname}/static_data/antibiotics.json`);
});

// let subtreeError = false;
apiRouter.get('/species/:speciesId/collection/:collectionId/subtree/:subtreeId',
  (req, res) => {
    // subtreeError = !subtreeError;
    setTimeout(() => (
      // subtreeError ?
      //   res.sendStatus(500) :
        res.sendFile(`${__dirname}/static_data/${req.params.subtreeId}.json`)
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
  (req, res) => res.sendFile(`${__dirname}/static_data/metadata.csv`)
);

const fastaStoragePath = './fastas';
fastaStorage.setup(fastaStoragePath);

let uploadError = false;
apiRouter.post('/upload', (req, res) => {
  // uploadError = !uploadError;
  return uploadError ?
    setTimeout(() => res.sendStatus(500), 500) :
    fastaStorage.store(fastaStoragePath, req)
      .then(({ fileId, metrics, specieator: { taxId, scientificName } }) => {
        // let country;
        //
        // if (req.query.lat && req.query.lon) {
        //   country = getCountry(
        //     Number.parseFloat(req.query.lat), Number.parseFloat(req.query.lon)
        //   );
        // }

        res.json({
          id: fileId,
          speciesId: taxId,
          speciesName: scientificName,
          metrics,
          // country,
        });
      }).
      catch(error => next(error));
});

apiRouter.post('/collection', (req, res) =>
  setTimeout(() => res.json({ collectionId: '123' }), 2000)
);

app.use('/api', apiRouter);

app.set('view engine', 'ejs');

app.use('/', (req, res) =>
  res.render('index', {
    googleMapsKey: 'AIzaSyBUn4F1N7KKElr6Qcwxvm7v3IzDoI0aQzE',
    frontEndConfig: JSON.parse(fs.readFileSync('./config.json')),
  })
);

app.listen(8080, '0.0.0.0');
