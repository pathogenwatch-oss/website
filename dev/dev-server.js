/* eslint-disable no-console */

const express = require('express');
const webpack = require('webpack');

// const createServer = require('../server');

const config = require('../webpack.config.js');
const getFrontEndSettings = require('../server/get-front-end-settings');
const compiler = webpack(config);

function createDevServer(app) {
  app.use(
    require('webpack-dev-middleware')(compiler, {
      contentBase: '/public',
      publicPath: config.output.publicPath,
      stats: { colors: true, cached: false },
      hot: true,
    })
  );

  app.use(require('webpack-hot-middleware')(compiler));

  app.use('/', (req, res) =>
    res.render('index', {
      frontEndConfig: getFrontEndSettings(req),
      files: {
        scripts: [ '/dev.js' ],
        stylesheets: [],
      },
    })
  );

  return app;
}

Promise.resolve(new express())
  .then(createDevServer)
  // .then(createServer)
  .then(() => console.info('*** Dev server started ***'))
  .catch(error => {
    console.error(error);
    console.error('*** Dev server not started ***');
    return process.exit(1);
  });
