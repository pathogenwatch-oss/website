/* eslint es6: false */

var path = require('path');
var webpack = require('webpack');

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
      { test: /.css$/, loaders: [ 'style', 'css' ] },
      { test: /\.(png|jpg|jpeg|gif)$/, loader: "file" }
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
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
  ],
  module: {
    loaders: [
      { test: /\.js$/,
        loaders: [ 'babel' ],
        include: path.join(__dirname, 'src')
      },
      { test: /.json$/, loaders: [ 'json' ] },
      { test: /.css$/, loaders: [ 'style', 'css' ] },
      { test: /\.(png|jpg|jpeg|gif)$/, loader: "file" }
    ]
  }
};

module.exports = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
