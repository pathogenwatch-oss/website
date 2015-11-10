const path = require('path');
const webpack = require('webpack');

const resolve = {
  alias: {
    '^': path.join(__dirname, 'src'),
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

const devConfig = {
  devtool: '#eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src/app',
  ],
  output: {
    path: __dirname,
    filename: 'wgsa.js',
    publicPath: '/',
  },
  resolve,
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [
      { test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'src'),
        query: {
          stage: 0,
          plugins: [
            'react-transform',
          ],
          extra: {
            'react-transform': {
              transforms: [ {
                transform: 'react-transform-hmr',
                imports: [ 'react' ],
                locals: [ 'module' ],
              }, {
                transform: 'react-transform-catch-errors',
                imports: [ 'react', 'redbox-react' ],
              } ],
            },
          },
        },
      },
    ].concat(commonLoaders),
  },
  postcss,
};

const prodConfig = {
  entry: './src/app',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'wgsa.js',
  },
  resolve,
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
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
  ],
  module: {
    loaders: [
      { test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'src'),
      },
    ].concat(commonLoaders),
  },
  postcss,
};

module.exports = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
