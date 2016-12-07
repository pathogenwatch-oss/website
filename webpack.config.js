const path = require('path');
const webpack = require('webpack');

const srcFolder = path.join(__dirname, 'src');

const resolveFallback = path.resolve(__dirname, 'node_modules');
const resolve = {
  alias: {
    '^': srcFolder,
  },
  fallback: resolveFallback,
};
const resolveLoader = {
  fallback: resolveFallback,
};

const postcss = [
  require('postcss-input-style'),
  require('postcss-cssnext')({
    feature: {
      autoprefixer: {
        browsers: [ 'last 2 versions', 'Safari 8' ],
      },
    },
  }),
];

const babelSettings = {
  extends: path.join(__dirname, '/.babelrc'),
};

const loaders = [
  { test: /.json$/, loaders: [ 'json' ] },
  { test: /.css$/, loaders: [ 'style', 'css', 'postcss' ] },
  { test: /\.(png|jpg|jpeg|gif)$/, loader: 'file' },
  { test: /\.js$/,
    // loader: (process.env.NODE_ENV === 'production' ? '' : 'react-hot!').concat(`babel?${JSON.stringify(babelSettings)}`),
    loader: `babel?${JSON.stringify(babelSettings)}`,
    include: [
      /(src|universal|cgps-commons)/,
      path.join(__dirname, 'node_modules', 'promise-file-reader'),
    ],
  },
];

const commonPlugins = [
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
];

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
  resolveLoader,
  plugins: commonPlugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ]),
  module: {
    loaders,
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
  resolveLoader,
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
    loaders,
  },
  postcss,
};

module.exports = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
