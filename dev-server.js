const fs = require('fs');

const webpack = require('webpack');
const express = require('express');
const bodyParser = require('body-parser');

const config = require('./webpack.config.js');
const compiler = webpack(config);

const app = express();

app.use(
  require('webpack-dev-middleware')(compiler, {
    contentBase: '/public',
    publicPath: config.output.publicPath,
    stats: { colors: true, cached: false },
  })
);

app.use(require('webpack-hot-middleware')(compiler));

app.use(bodyParser.json());

app.use(express.static('public'));

const getPath = folder => `${__dirname}/static_data/${folder}`;

const apiRouter = express.Router();

apiRouter.get('/summary', (req, res) => {
  res.sendFile(`${__dirname}/static_data/summary.json`);
});


/* Genomes */

apiRouter.get('/genome/summary', (req, res) => {
  res.sendFile(`${__dirname}/static_data/genomes/summary.json`);
});

apiRouter.get('/genome/:id', (req, res) => {
  res.sendFile(`${__dirname}/static_data/genomes/report.json`);
});


/* Collections */

apiRouter.get('/collection', (req, res) => {
  setTimeout(() => {
    res.sendFile(`${__dirname}/static_data/collections.json`);
  }, 0);
});

apiRouter.get('/collection/:id', (req, res) => {
  setTimeout(() => {
    res.sendFile(`${getPath(req.params.id)}/collection.json`);
  }, 0);
});

apiRouter.get('/collection/:id/tree/:subtree', (req, res) => {
  setTimeout(
    () =>
      res.sendFile(
        `${getPath(req.params.id)}/${req.params.subtree}.json`
      ),
    1000
  );
});

apiRouter.post('/collection', (req, res) =>
  setTimeout(() => res.json({ collectionId: '123' }), 2000)
);


/* Clustering */

apiRouter.get('/clustering/:id', (req, res) => {
  setTimeout(() => res.sendFile(`${getPath('clustering')}/collection.json`), 1000);
});

apiRouter.get('/genome/:id/clusters', (req, res) => {
  setTimeout(() => res.sendFile(`${getPath('clustering')}/clusters.json`), 1000);
});

apiRouter.post('/genome/:id/clusters/edges', (req, res) => {
  setTimeout(() => res.sendFile(`${getPath('clustering')}/edges.json`), 1000);
});


const assemblerRouter = express.Router();

assemblerRouter.get('/account', (req, res) => {
  setTimeout(
    () =>
      res.json({
        usage: {
          user: 20,
          total: 43,
        },
        limits: {
          user: 30,
          total: 100,
        },
        remaining: 10,
        // error: 'Usage limits exceeded: only 30 assemblies permitted per user',
      }),
    1000
  );
});

assemblerRouter.get('/chunks', (req, res) => {
  setTimeout(() => res.sendStatus(200), 1000);
});

assemblerRouter.post('/pipelines', (req, res) => {
  setTimeout(() => res.sendStatus(201), 1000);
});

assemblerRouter.use((req, res) => {
  setTimeout(() => res.json({}), 1000);
});

app.use('/api', apiRouter);
app.use('/assembler/api', assemblerRouter);

app.set('view engine', 'ejs');

app.use('/', (req, res) =>
  res.render('index', {
    frontEndConfig: JSON.parse(fs.readFileSync('./config.json')),
    files: {
      scripts: [ '/dev.js' ],
      stylesheets: [],
    },
  })
);

app.listen(process.env.PORT || 8080, '0.0.0.0');
