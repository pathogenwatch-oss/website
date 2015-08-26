/* eslint es6: false */

var path = require('path');
var webpack = require('webpack');
var extractTextPlugin = require("extract-text-webpack-plugin");

var devConfig = {
  devtool: '#eval-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src/app'
  ],
  output: {
    path: __dirname,
    filename: 'wgsa.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      { test: /\.js$/,
        loaders: [ 'react-hot', 'babel' ],
        include: path.join(__dirname, 'src')
      },
      { test: /.json$/, loaders: [ 'json' ] },
      { test: /.css$/, loaders: [ 'style', 'css' ] }
    ]
  }
};

var prodConfig = {
  entry: './src/app',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'wgsa.js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new extractTextPlugin('wgsa.css')
  ],
  module: {
    loaders: [
      { test: /\.js$/,
        loaders: [ 'babel' ],
        include: path.join(__dirname, 'src')
      },
      { test: /.json$/, loaders: [ 'json' ] },
      { test: /.css$/, loader: extractTextPlugin.extract('style', 'css') }
    ]
  }
};

module.exports = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
