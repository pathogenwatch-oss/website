/* eslint es6: false */

var path = require('path');
var webpack = require('webpack');

var postcssPlugins = [
  require('autoprefixer')({ browsers: ['last 2 versions'] }),
  require('postcss-input-style')
];

var commonLoaders = [
  { test: /.json$/, loaders: [ 'json' ] },
  { test: /.css$/, loaders: [ 'style', 'css', 'postcss' ] },
  { test: /\.(png|jpg|jpeg|gif)$/, loader: "file" }
];

var devConfig = {
  devtool: '#eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src/app'
  ],
  output: {
    path: __dirname,
    filename: 'wgsa.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      { test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'src'),
        query: {
          'stage': 0,
          'plugins': [
            'react-transform'
          ],
          'extra': {
            'react-transform': [ {
              'target': 'react-transform-webpack-hmr',
              'imports': [ 'react' ],
              'locals': [ 'module' ]
            }, {
              'target': 'react-transform-catch-errors',
              'imports': [ 'react', 'redbox-react' ]
            }]
          }
        }
      }
    ].concat(commonLoaders)
  },
  postcss: postcssPlugins
};

var prodConfig = {
  entry: './src/app',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'wgsa.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
  ],
  module: {
    loaders: [
      { test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'src')
      }
    ].concat(commonLoaders)
  },
  postcss: postcssPlugins
};

module.exports = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
