const path = require('path');
const webpack = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const srcFolder = path.join(__dirname, 'src');

const resolve = {
  alias: {
    '^': srcFolder,
    '~': srcFolder,
    react: path.join(srcFolder, 'react-shim.js'),
  },
  modules: [ 'node_modules', path.join(__dirname, 'node_modules') ],
  unsafeCache: true,
};

const babelSettings = {
  extends: path.join(__dirname, '/.babelrc'),
  cacheDirectory: true,
};

const cssLoaders = [
  { loader: 'css-loader', options: { importLoaders: 1 } },
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [
        require('postcss-input-style')(),
        require('postcss-preset-env')({
          features: {
            customProperties: false,
          },
        }),
      ],
    },
  },
];

const commonRules = [
  { test: /\.(png|jpg|jpeg|gif)$/, use: 'file' },
  {
    test: /\.js$/,
    // loader: (process.env.NODE_ENV === 'production' ? '' : 'react-hot-loader!').concat(`babel-loader?${JSON.stringify(babelSettings)}`),
    loader: `babel-loader?${JSON.stringify(babelSettings)}`,
    include: [
      /(src|universal|cgps-commons|libmicroreact)/,
      path.join(__dirname, 'node_modules', 'promise-file-reader'),
      path.join(__dirname, 'node_modules', 'cgps-commons'),
      path.join(__dirname, 'node_modules', 'cgps-user-accounts', 'components'),
      path.join(__dirname, 'node_modules', '@cgps', 'phylocanvas', 'utils'),
    ],
  },
  {
    test: /\.svg$/,
    use: [ {
      loader: '@svgr/webpack',
      options: {
        icon: true,
      },
    } ],
  },
];

const commonPlugins = [
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
];

const devConfig = {
  mode: 'development',
  devServer: { hot: true },
  devtool: '#eval-source-map',
  entry: [ 'react-hot-loader/patch', 'webpack-hot-middleware/client', './src' ],
  output: {
    path: __dirname,
    filename: 'dev.js',
    publicPath: '/',
  },
  resolve,
  plugins: [
    ...commonPlugins,
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      ...commonRules,
      { test: /\.css$/, use: [ { loader: 'style-loader', options: { attrs: { media: 'all' } } }, ...cssLoaders ] },
    ],
  },
};

const prodConfig = {
  mode: 'production',
  entry: {
    main: './src',
    vendor: [
      'commonmark',
      'leaflet',
      'leaflet.markercluster',
      'papaparse',
      '@cgps/phylocanvas',
      '@cgps/phylocanvas-plugin-context-menu',
      '@cgps/phylocanvas-plugin-interactions',
      '@cgps/phylocanvas-plugin-metadata',
      '@cgps/phylocanvas-plugin-scalebar',
      '@cgps/phylocanvas-plugin-svg-export',
      'react',
      'react-dom',
    ],
  },
  optimization: {
    runtimeChunk: 'single',
  },
  output: {
    path: path.join(__dirname, 'public', 'app'),
    filename: '[name].[chunkhash].js',
    publicPath: '/app/',
  },
  resolve,
  plugins: [
    ...commonPlugins,
    new WebpackAssetsManifest({
      output: '../../assets.json', // relative to output.path
      publicPath: true,
    }),
    new CleanWebpackPlugin([ 'public/app', 'assets.json' ]),
    new ExtractTextPlugin('styles.[hash].css'),
  ],
  module: {
    rules: [
      ...commonRules,
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: cssLoaders,
        }),
      },
    ],
  },
};

module.exports = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
