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

apiRouter.get('/summary', (req, res) => {
  res.sendFile(`${__dirname}/static_data/summary.json`);
});

apiRouter.get('/collection', (req, res) => {
  setTimeout(() => {
    res.sendFile(`${__dirname}/static_data/collections.json`);
  }, 0);
});

apiRouter.get('/collection/:id', (req, res) => {
  setTimeout(() => {
    res.sendFile(`${getCollectionPath(req.params.id)}/collection.json`);
  }, 0);
});

// let subtreeError = false;
apiRouter.get('/collection/:id/tree/:subtree',
  (req, res) => {
    // subtreeError = !subtreeError;
    setTimeout(() => (
      // subtreeError ?
      //   res.sendStatus(500) :
        res.sendFile(`${getCollectionPath(req.params.id)}/${req.params.subtree}.json`)
    ), 1000);
  }
);

apiRouter.post('/collection', (req, res) =>
  setTimeout(() => res.json({ collectionId: '123' }), 2000)
);

app.use('/api', apiRouter);

app.set('view engine', 'ejs');

app.use('/', (req, res) => res.render('index', {
  frontEndConfig: JSON.parse(fs.readFileSync('./config.json')),
  files: {
    scripts: [ '/dev.js' ],
    stylesheets: [],
  },
}));

app.listen(process.env.PORT || 8080, '0.0.0.0');
