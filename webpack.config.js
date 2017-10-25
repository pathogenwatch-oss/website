const path = require('path');
const webpack = require('webpack');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackMonitor = require('webpack-monitor');

const srcFolder = path.join(__dirname, 'src');

const resolve = {
  alias: {
    '^': srcFolder,
    react: path.join(srcFolder, 'react-shim.js'),
  },
  unsafeCache: true,
};

const babelSettings = {
  extends: path.join(__dirname, '/.babelrc'),
};

const rules = [
  { test: /\.json$/, use: [ 'json-loader' ] },
  { test: /\.css$/, use: [
    'style-loader',
    { loader: 'css-loader', options: { importLoaders: 1 } },
    { loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-input-style')(),
          require('postcss-cssnext')({
            feature: {
              autoprefixer: {
                browsers: [ 'last 2 versions', 'Safari 8' ],
              },
            },
          }),
        ],
      },
    },
  ] },
  { test: /\.(png|jpg|jpeg|gif)$/, use: 'file' },
  { test: /\.js$/,
    // loader: (process.env.NODE_ENV === 'production' ? '' : 'react-hot-loader!').concat(`babel-loader?${JSON.stringify(babelSettings)}`),
    loader: `babel-loader?${JSON.stringify(babelSettings)}`,
    include: [
      /(src|universal|cgps-commons)/,
      path.join(__dirname, 'node_modules', 'promise-file-reader'),
      path.join(__dirname, 'node_modules', 'cgps-commons'),
    ],
  },
];

const commonPlugins = [
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  // https://github.com/postcss/postcss-loader/issues/99#issuecomment-255367959
  new webpack.ProvidePlugin({
    createClass: 'create-react-class',
    PropTypes: 'prop-types',
  }),
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
  plugins: commonPlugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ]),
  module: {
    rules,
  },
};

const prodConfig = {
  entry: {
    wgsa: './src',
    vendor: [
      'commonmark',
      'leaflet',
      'leaflet.markercluster',
      'papaparse',
      'phylocanvas',
      'phylocanvas/polyfill.js',
      'react',
      'react-dom',
    ],
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].[chunkhash].js',
    publicPath: '/',
  },
  resolve,
  plugins: commonPlugins.concat([
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: [ 'wgsa', 'vendor', 'manifest' ],
    }),
    // new BundleAnalyzerPlugin(),
    new WebpackMonitor({
      capture: true,
      target: '../monitor.json',
      launch: true,
    }),
  ]),
  module: {
    rules,
  },
};

module.exports = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
