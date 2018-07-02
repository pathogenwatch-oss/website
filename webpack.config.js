const path = require('path');
const webpack = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const WebpackMonitor = require('webpack-monitor');
const NameAllModulesPlugin = require('name-all-modules-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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

const cssLoaders = [
  { loader: 'css-loader', options: { importLoaders: 1 } },
  { loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [
        require('postcss-input-style')(),
        require('postcss-cssnext')({
          features: {
            autoprefixer: {
              browsers: [ 'last 2 versions' ],
            },
            customProperties: {
              warnings: false,
            },
          },
        }),
      ],
    },
  },
];

const commonRules = [
  { test: /\.json$/, use: [ 'json-loader' ] },
  { test: /\.(png|jpg|jpeg|gif)$/, use: 'file' },
  { test: /\.js$/,
    // loader: (process.env.NODE_ENV === 'production' ? '' : 'react-hot-loader!').concat(`babel-loader?${JSON.stringify(babelSettings)}`),
    loader: `babel-loader?${JSON.stringify(babelSettings)}`,
    include: [
      /(src|universal|cgps-commons|libmicroreact)/,
      path.join(__dirname, 'node_modules', 'promise-file-reader'),
      path.join(__dirname, 'node_modules', 'cgps-commons'),
      path.join(__dirname, 'node_modules', 'cgps-user-accounts', 'components'),
    ],
  },
];

const commonPlugins = [
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
];

const devConfig = {
  devtool: '#eval-source-map',
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    './src',
  ],
  output: {
    path: __dirname,
    filename: 'dev.js',
    publicPath: '/',
  },
  resolve,
  plugins: [
    ...commonPlugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  module: {
    rules: [
      ...commonRules,
      { test: /\.css$/, use: [ 'style-loader', ...cssLoaders ] },
    ],
  },
};

const prodConfig = {
  entry: {
    main: './src',
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
    path: path.join(__dirname, 'public', 'app'),
    filename: '[name].[chunkhash].js',
    publicPath: '/app/',
  },
  resolve,
  plugins: [
    ...commonPlugins,
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
      name: 'vendor',
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin((chunk) => {
      if (chunk.name) {
        return chunk.name;
      }
      return chunk.mapModules(m => path.relative(m.context, m.request)).join('_');
    }),
    new NameAllModulesPlugin(),
    new WebpackMonitor({
      capture: true,
      target: '../monitor.json',
      // launch: true,
    }),
    new WebpackAssetsManifest({
      output: '../../assets.json', // relative to output.path
      publicPath: true,
    }),
    new CleanWebpackPlugin([ 'public/app', 'assets.json' ]),
    new ExtractTextPlugin('styles.[contenthash].css'),
  ],
  module: {
    rules: [
      ...commonRules,
      { test: /\.css$/,
        use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: cssLoaders }),
      },
    ],
  },
};

module.exports = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
