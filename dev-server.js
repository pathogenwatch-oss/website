const fspath = require('path');

const webpack = require('webpack');
const express = require('express');
const bodyParser = require('body-parser');
const fastaStorage = require('wgsa-fasta-store');
const createMashSpecieator = require('mash-specieator');

const config = require('./webpack.config.js');
const compiler = webpack(config);

const referencesDir = require('mash-sketches');
const sketchFilePath = fspath.join(referencesDir, 'refseq-archaea-bacteria-fungi-viral-k16-s400.msh');
const metadataFilePath = fspath.join(referencesDir, 'refseq-archaea-bacteria-fungi-viral-k16-s400.csv');
const specieator = createMashSpecieator(sketchFilePath, metadataFilePath);

const analyse = require('./universal/fastaAnalysis');

const app = express();

app.use(require('webpack-dev-middleware')(compiler, {
  contentBase: '/public',
  publicPath: config.output.publicPath,
  stats: { colors: true, cached: false },
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(bodyParser.text({ limit: '10mb' }));

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


apiRouter.get('/species/:speciesId/collection/:collectionId/subtree/:subtreeId',
  (req, res) =>
    setTimeout(() =>
      res.sendFile(`${__dirname}/static_data/${req.params.subtreeId}.json`)
      // res.sendStatus(500)
    , 1000)
);

apiRouter.post('/download/type/assembly/format/fasta', (req, res) => {
  setTimeout(() => {
    res.json({ checksum: `${req.body.idList[0]}.fa` });
  }, 1000);
});

let downloadError = false;
apiRouter.post('/download/type/:idType/format/:fileFormat', (req, res) => {
  downloadError = !downloadError;
  setTimeout(() => (
    downloadError ?
      res.sendStatus(500) :
      res.json({ checksum: req.params.fileFormat })
  ), 1000);
});

apiRouter.get(
  '/download/file/:fileName',
  (req, res) => res.sendFile(`${__dirname}/static_data/metadata.csv`)
);

const speciesIds = new Set(require('./universal/species').map(_ => _.id));

function getWGSASpeciesId(...ids) {
  for (const id of ids) {
    if (speciesIds.has(id)) return id;
  }
  return null;
}

apiRouter.post('/upload', (req, res) => {
  fastaStorage.store('./fastas', req.body).
    then(({ path, id }) =>
      specieator.queryFile(path).
        then(({ speciesTaxId, taxId, scientificName }) => ({
          speciesId: getWGSASpeciesId(speciesTaxId, taxId),
          speciesName: scientificName,
          id,
        }))
    ).
    then(result =>
      res.json(Object.assign({ metrics: analyse(req.body) }, result))
    );
});

apiRouter.post('/collection', (req, res) =>
  setTimeout(() => res.json({ collectionId: '123' }), 2000)
);

app.use('/api', apiRouter);

app.set('view engine', 'ejs');

app.use('/', (req, res) =>
  res.render('index', {
    googleMapsKey: 'AIzaSyBUn4F1N7KKElr6Qcwxvm7v3IzDoI0aQzE',
    frontEndConfig: {
      pusherKey: '8b8d274e51643f85f81a',
      mapboxKey: 'pk.eyJ1IjoiY2dwc2RldiIsImEiOiJjaW96aXdzdDEwMGV0dm1tMnhqOWIzNXViIn0.2lJftMpp7LBJ_FeumUE4qw',
      // api: {
      //   address: 'localhost:8001',
      // },
    },
  })
);

app.listen(8080, '0.0.0.0');
