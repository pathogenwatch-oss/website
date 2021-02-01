const createServer = require('../server');

const fs = require('fs');

const webpack = require('webpack');

const config = require('../front-end/webpack.config.js');
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
      frontEndConfig: app.get('front-end-config'),
      files: {
        scripts: [ '/dev.js' ],
        stylesheets: [],
      },
    })
  );
}

createServer(true)
  .then(createDevServer)
  .then(() => console.info('*** Dev server started ***')).
  catch(error => {
    console.error(error);
    console.error('*** Dev server not started ***');
    return process.exit(1);
  });
