const path = require('path');
const webpack = require('webpack');

const srcFolder = path.join(__dirname, 'src');

const resolve = {
  alias: {
    '^': srcFolder,
  },
};

const postcss = [
  require('autoprefixer')({ browsers: [ 'last 2 versions' ] }),
  require('postcss-input-style'),
];

const commonLoaders = [
  { test: /.json$/, loaders: [ 'json' ] },
  { test: /.css$/, loaders: [ 'style', 'css', 'postcss' ] },
  { test: /\.(png|jpg|jpeg|gif)$/, loader: 'file' },
];

const commonPlugins = [
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
];

const commonBabelProps = {
  test: /\.js$/,
  loader: 'babel',
  include: /(src|universal)/,
  presets: [ 'react', 'es2015', 'stage-0' ]
};

const devConfig = {
  devtool: '#eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src',
  ],
  output: {
    path: __dirname,
    filename: 'wgsa.js',
    publicPath: '/',
  },
  resolve,
  plugins: commonPlugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ]),
  module: {
    loaders: [
      { test: commonBabelProps.test,
        loader: commonBabelProps.loader,
        include: commonBabelProps.include,
        query: {
          presets: commonBabelProps.presets,
          plugins: [
            [ 'react-transform', {
              transforms: [ {
                transform: 'react-transform-hmr',
                imports: [ 'react' ],
                locals: [ 'module' ],
              }, {
                transform: 'react-transform-catch-errors',
                imports: [ 'react', 'redbox-react' ],
              } ],
            } ],
          ],
        },
      },
    ].concat(commonLoaders),
  },
  postcss,
};

const prodConfig = {
  entry: './src',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'wgsa.js',
    publicPath: '/',
  },
  resolve,
  plugins: commonPlugins.concat([
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ]),
  module: {
    loaders: [
      { test: commonBabelProps.test,
        loader: commonBabelProps.loader,
        include: commonBabelProps.include,
        query: {
          presets: commonBabelProps.presets,
        },
      },
    ].concat(commonLoaders),
  },
  postcss,
};

module.exports = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
